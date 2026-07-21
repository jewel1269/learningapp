import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../src/app';
import { User } from '../src/modules/users/user.model';
import { RefreshToken } from '../src/modules/auth/refreshToken.model';
import { SkillAssessment } from '../src/modules/assessments/skillAssessment.model';
import { SkillAssessmentSubmission } from '../src/modules/assessments/skillAssessmentSubmission.model';
import {
  generateSkillAssessment,
  submitSkillAssessment,
  scoreToLevel,
  type SkillAssessmentGenerator,
} from '../src/modules/assessments/skillAssessment.service';
import type { GeneratedSkillAssessment } from '../src/modules/assessments/skillAssessment.schema';
import { redis } from '../src/config/redis';

const TEST_DB = 'mongodb://127.0.0.1:27017/b2c_test_skill_assessment';

const mcqQuestions = Array.from({ length: 10 }, (_, i) => ({
  question: `Question ${i + 1}?`,
  type: 'mcq' as const,
  options: ['A', 'B', 'C', 'D'],
  correctAnswer: 'A',
}));

const fakeGen: SkillAssessmentGenerator = async () => ({ questions: mcqQuestions });

async function signup(email = 'skill@example.com') {
  const res = await request(app).post('/auth/signup').send({ email, password: 'supersecret1' });
  return { token: res.body.accessToken as string, userId: res.body.user.id as string };
}

beforeAll(async () => {
  await mongoose.connect(TEST_DB);
});

afterEach(async () => {
  await Promise.all([
    User.deleteMany({}),
    RefreshToken.deleteMany({}),
    SkillAssessment.deleteMany({}),
    SkillAssessmentSubmission.deleteMany({}),
  ]);
  const keys = await redis.keys('rl:*');
  if (keys.length) await redis.del(...keys);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
  redis.disconnect();
});

describe('scoreToLevel', () => {
  it('maps score ranges to skill levels', () => {
    expect(scoreToLevel(20)).toBe('Beginner');
    expect(scoreToLevel(50)).toBe('Intermediate');
    expect(scoreToLevel(75)).toBe('Advanced');
    expect(scoreToLevel(95)).toBe('Expert');
  });
});

describe('skill assessment API', () => {
  it('lists predefined topics', async () => {
    const res = await request(app).get('/skill-assessments/topics');
    expect(res.status).toBe(200);
    expect(res.body.topics).toContain('Programming');
    expect(res.body.topics).toContain('Other');
  });

  it('generates a guest assessment and serves it without answers', async () => {
    const assessment = await generateSkillAssessment(
      { topic: 'Programming', guestSessionId: crypto.randomUUID() },
      undefined,
      'free',
      fakeGen,
    );

    const res = await request(app).get(`/skill-assessments/${assessment.id}`);
    expect(res.status).toBe(200);
    expect(res.body.assessment.questions).toHaveLength(10);
    expect(res.body.assessment.questions[0].correctAnswer).toBeUndefined();
  });

  it('requires auth to submit and returns level + score', async () => {
    const { token, userId } = await signup();
    const assessment = await generateSkillAssessment({ topic: 'Networking' }, userId, 'free', fakeGen);

    const unauth = await request(app)
      .post(`/skill-assessments/${assessment.id}/submit`)
      .send({ answers: [{ questionIndex: 0, answer: 'A' }] });
    expect(unauth.status).toBe(401);

    const answers = mcqQuestions.map((_, i) => ({ questionIndex: i, answer: 'A' }));
    const submission = await submitSkillAssessment(userId, assessment.id, answers);
    expect(submission.score).toBe(100);
    expect(submission.level).toBe('Expert');

    const res = await request(app)
      .get(`/skill-assessments/${assessment.id}/result`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.submission.level).toBe('Expert');
    expect(res.body.submission.score).toBe(100);
  });

  it('rejects duplicate submission', async () => {
    const { userId } = await signup('dup@example.com');
    const assessment = await generateSkillAssessment({ topic: 'General' }, userId, 'free', fakeGen);
    const answers = [{ questionIndex: 0, answer: 'A' }];
    await submitSkillAssessment(userId, assessment.id, answers);
    await expect(submitSkillAssessment(userId, assessment.id, answers)).rejects.toMatchObject({
      statusCode: 409,
    });
  });

  it('validates Other topic requires customTopic on generate', async () => {
    const res = await request(app)
      .post('/skill-assessments/generate')
      .send({ topic: 'Other' });
    expect(res.status).toBe(400);
  });

  it('lists guest assessments and enforces free-plan quota', async () => {
    const guestSessionId = crypto.randomUUID();
    for (let i = 0; i < 3; i += 1) {
      await generateSkillAssessment({ topic: 'General', guestSessionId }, undefined, 'free', fakeGen);
    }

    const list = await request(app)
      .get('/skill-assessments/mine')
      .query({ guestSessionId });
    expect(list.status).toBe(200);
    expect(list.body.assessments).toHaveLength(3);
    expect(list.body.quota.used).toBe(3);
    expect(list.body.quota.remaining).toBe(0);

    const blocked = await request(app)
      .post('/skill-assessments/generate')
      .send({ topic: 'Programming', guestSessionId });
    expect(blocked.status).toBe(429);
  });

  it('marks guest assessment completed after authenticated submit', async () => {
    const { token, userId } = await signup('claimed@example.com');
    const guestSessionId = crypto.randomUUID();
    const assessment = await generateSkillAssessment(
      { topic: 'Cyber Security', guestSessionId },
      undefined,
      'free',
      fakeGen,
    );
    const answers = mcqQuestions.map((_, i) => ({ questionIndex: i, answer: 'A' }));
    await submitSkillAssessment(userId, assessment.id, answers);

    const list = await request(app)
      .get('/skill-assessments/mine')
      .set('Authorization', `Bearer ${token}`)
      .query({ guestSessionId });
    expect(list.status).toBe(200);
    expect(list.body.assessments).toHaveLength(1);
    expect(list.body.assessments[0].status).toBe('completed');
    expect(list.body.assessments[0].submission.score).toBe(100);
  });
});

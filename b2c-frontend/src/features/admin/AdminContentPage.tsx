'use client';

import { useState } from 'react';
import { useTranslation } from '@/src/i18n';
import { ApiError } from '@/src/infrastructure/apiClient';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Skeleton } from '@/src/components/ui/skeleton';
import type { ContentType } from './adminApi';
import {
  useAdminContent,
  useAdminFlags,
  useFlagContent,
  useRegenerateContent,
  useResolveFlag,
} from './useAdmin';

const CONTENT_TYPES: ContentType[] = ['course', 'lesson', 'exercise', 'quiz'];

function contentTitle(item: Record<string, unknown>) {
  return (
    (item.title as string | undefined) ??
    (item.question as string | undefined) ??
    String(item._id ?? item.id ?? 'Untitled')
  );
}

function contentId(item: Record<string, unknown>) {
  return String(item._id ?? item.id ?? '');
}

function mutationMessage(error: unknown) {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) return error.message;
  return 'Action failed.';
}

export function AdminContentPage() {
  const { t } = useTranslation();
  const [type, setType] = useState<ContentType>('course');
  const [page, setPage] = useState(1);
  const [flagReason, setFlagReason] = useState('');
  const [activeFlagId, setActiveFlagId] = useState<string | null>(null);

  const contentQ = useAdminContent(type, page);
  const flagsQ = useAdminFlags('open');
  const flagMut = useFlagContent();
  const regenMut = useRegenerateContent();
  const resolveMut = useResolveFlag();

  const totalPages = contentQ.data ? Math.max(1, Math.ceil(contentQ.data.total / contentQ.data.limit)) : 1;

  return (
    <div className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-8">
      <h2 className="text-2xl font-bold text-ink">{t('admin.contentTitle')}</h2>

      <div className="mt-6 flex flex-wrap gap-2">
        {CONTENT_TYPES.map((item) => (
          <Button
            key={item}
            variant={type === item ? 'primary' : 'soft'}
            size="sm"
            onClick={() => {
              setType(item);
              setPage(1);
            }}
          >
            {item}
          </Button>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section className="rounded-2xl border border-line bg-bg-elev p-5 shadow-soft">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-bold capitalize text-ink">{type} content</h3>
            <span className="text-sm text-ink-3">{contentQ.data?.total ?? 0} total</span>
          </div>

          {contentQ.isLoading ? (
            <div className="mt-4 space-y-3">
              <Skeleton className="h-20 rounded-xl" />
              <Skeleton className="h-20 rounded-xl" />
            </div>
          ) : null}

          {contentQ.isError ? (
            <div className="mt-4 text-sm text-bad">{t('admin.accessDenied')}</div>
          ) : null}

          <div className="mt-4 space-y-3">
            {contentQ.data?.items.map((item) => {
              const id = contentId(item);
              return (
                <div key={id} className="rounded-xl border border-line bg-bg-soft p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-ink">{contentTitle(item)}</p>
                      <p className="mt-1 font-mono text-xs text-ink-3">{id}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="soft"
                        size="sm"
                        disabled={regenMut.isPending || type === 'lesson'}
                        onClick={() => regenMut.mutate({ type, id })}
                      >
                        Regenerate
                      </Button>
                      <Button
                        variant="soft"
                        size="sm"
                        onClick={() => {
                          setActiveFlagId(id);
                          setFlagReason('');
                        }}
                      >
                        Flag
                      </Button>
                    </div>
                  </div>
                  {activeFlagId === id ? (
                    <div className="mt-3 space-y-2">
                      <Input
                        value={flagReason}
                        onChange={(e) => setFlagReason(e.target.value)}
                        placeholder="Reason for flagging…"
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          disabled={!flagReason.trim() || flagMut.isPending}
                          onClick={() =>
                            flagMut.mutate(
                              { type, id, reason: flagReason.trim() },
                              {
                                onSuccess: () => {
                                  setActiveFlagId(null);
                                  setFlagReason('');
                                },
                              },
                            )
                          }
                        >
                          Submit flag
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setActiveFlagId(null)}>
                          {t('common.cancel')}
                        </Button>
                      </div>
                      {flagMut.isError ? (
                        <p className="text-xs text-bad">{mutationMessage(flagMut.error)}</p>
                      ) : null}
                    </div>
                  ) : null}
                  {regenMut.isError && regenMut.variables?.id === id ? (
                    <p className="mt-2 text-xs text-bad">{mutationMessage(regenMut.error)}</p>
                  ) : null}
                </div>
              );
            })}
          </div>

          {contentQ.data && contentQ.data.items.length === 0 ? (
            <p className="mt-4 text-sm text-ink-2">No content found.</p>
          ) : null}

          <div className="mt-4 flex items-center justify-between gap-3">
            <Button variant="soft" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
              Previous
            </Button>
            <span className="text-sm text-ink-3">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="soft"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </section>

        <section className="rounded-2xl border border-line bg-bg-elev p-5 shadow-soft">
          <h3 className="font-bold text-ink">Open flags</h3>
          {flagsQ.isLoading ? <Skeleton className="mt-4 h-32 rounded-xl" /> : null}
          <div className="mt-4 space-y-3">
            {flagsQ.data?.flags.map((flag) => (
              <div key={flag.id} className="rounded-xl border border-line bg-bg-soft p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="warn">{flag.contentType}</Badge>
                  <span className="font-mono text-xs text-ink-3">{flag.contentId}</span>
                </div>
                <p className="mt-2 text-sm text-ink">{flag.reason}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="soft"
                    disabled={resolveMut.isPending}
                    onClick={() => resolveMut.mutate({ flagId: flag.id, resolution: 'resolved' })}
                  >
                    Resolve
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    disabled={resolveMut.isPending}
                    onClick={() => resolveMut.mutate({ flagId: flag.id, resolution: 'dismissed' })}
                  >
                    Dismiss
                  </Button>
                </div>
              </div>
            ))}
            {flagsQ.data?.flags.length === 0 ? (
              <p className="text-sm text-ink-2">No open flags.</p>
            ) : null}
          </div>
        </section>
      </div>
    </div>
  );
}

export default AdminContentPage;

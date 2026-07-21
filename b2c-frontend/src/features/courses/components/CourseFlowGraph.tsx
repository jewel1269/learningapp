'use client';

import { useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Background, Controls, MiniMap, ReactFlow, type Edge, type Node } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useCourseStructure } from '@/src/features/courses';

const COL = 280;
const nodeBase = { width: 220, borderRadius: 12, padding: 10, fontSize: 13 } as const;

export default function CourseFlowGraph({ courseId }: { courseId: string }) {
  const router = useRouter();
  const { data, isLoading } = useCourseStructure(courseId);
  const status = data?.course.status;

  const { nodes, edges } = useMemo(() => {
    const modules = data?.modules ?? [];
    const ns: Node[] = [];
    const es: Edge[] = [];
    const centerX = ((Math.max(modules.length, 1) - 1) * COL) / 2;

    ns.push({
      id: 'course',
      position: { x: centerX, y: 0 },
      data: { label: data?.course.title ?? 'Course' },
      style: {
        ...nodeBase,
        background: 'var(--primary)',
        color: 'var(--primary-ink)',
        border: 'none',
        fontWeight: 700,
      },
    });

    modules.forEach((m, i) => {
      const mid = `m-${m.id}`;
      ns.push({
        id: mid,
        position: { x: i * COL, y: 170 },
        data: { label: `${String(i + 1).padStart(2, '0')} · ${m.title}` },
        style: {
          ...nodeBase,
          background: 'var(--primary-soft)',
          color: 'var(--primary)',
          border: '1px solid var(--primary)',
          fontWeight: 600,
        },
      });
      es.push({ id: `e-course-${mid}`, source: 'course', target: mid });

      m.lessons.forEach((l, j) => {
        const lid = `l-${l.id}`;
        ns.push({
          id: lid,
          position: { x: i * COL, y: 320 + j * 76 },
          data: { label: l.title, href: `/lesson/${l.id}` },
          style: {
            ...nodeBase,
            background: 'var(--bg-elev)',
            color: 'var(--ink)',
            border: '1px solid var(--line-2)',
            cursor: 'pointer',
          },
        });
        es.push({ id: `e-${mid}-${lid}`, source: mid, target: lid });
      });
    });

    return { nodes: ns, edges: es };
  }, [data]);

  const onNodeClick = useCallback(
    (_: unknown, node: Node) => {
      const href = (node.data as { href?: string }).href;
      if (href) router.push(href);
    },
    [router],
  );

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="size-6 animate-spin text-primary" />
      </div>
    );
  }

  if (status && status !== 'ready' && status !== 'completed') {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
        <p className="text-ink-2">This course isn&rsquo;t ready to explore yet.</p>
        <Link
          href={`/courses/${courseId}`}
          className="text-sm font-semibold text-primary hover:underline"
        >
          Back to course
        </Link>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      <Link
        href={`/courses/${courseId}`}
        className="absolute left-4 top-4 z-10 inline-flex items-center gap-1.5 rounded-lg border border-line bg-bg-elev px-3 py-2 text-sm font-medium text-ink shadow-soft hover:text-primary"
      >
        <ArrowLeft className="size-4" /> Course
      </Link>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodeClick={onNodeClick}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        nodesDraggable={false}
        nodesConnectable={false}
        minZoom={0.2}
      >
        <Background color="var(--line-2)" gap={20} />
        <Controls showInteractive={false} />
        <MiniMap pannable zoomable />
      </ReactFlow>
    </div>
  );
}

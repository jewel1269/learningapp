'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle, Download, Settings, Trash2 } from 'lucide-react';
import { useMe } from '@/src/features/auth';
import { ApiError } from '@/src/infrastructure/apiClient';
import { useTranslation } from '@/src/i18n';
import { LanguageSelector } from '@/src/components/layout/LanguageSelector';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Skeleton } from '@/src/components/ui/skeleton';
import { Switch } from '@/src/components/ui/switch';
import { useDeleteAccount, useExportUserData, useUpdatePreferences } from './useSettings';

const TIMEZONES = [
  'UTC',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Asia/Dubai',
  'Asia/Kolkata',
  'Asia/Dhaka',
  'Asia/Singapore',
  'Asia/Tokyo',
  'Australia/Sydney',
];

function mutationMessage(error: unknown) {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) return error.message;
  return 'Something went wrong. Please try again.';
}

function SettingsSkeleton() {
  return (
    <div className="mx-auto w-full max-w-2xl p-4 sm:p-6 lg:p-8">
      <Skeleton className="h-10 w-40" />
      <Skeleton className="mt-2 h-5 w-72" />
      <Skeleton className="mt-8 h-56 rounded-2xl" />
      <Skeleton className="mt-6 h-40 rounded-2xl" />
    </div>
  );
}

export function SettingsPage() {
  const { t } = useTranslation();
  const meQ = useMe();
  const updateMut = useUpdatePreferences();
  const exportMut = useExportUserData();
  const deleteMut = useDeleteAccount();

  const [visualsPreferred, setVisualsPreferred] = useState(true);
  const [dailyNotification, setDailyNotification] = useState(true);
  const [timezone, setTimezone] = useState('UTC');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deletePhrase, setDeletePhrase] = useState('');

  useEffect(() => {
    const prefs = meQ.data?.user.preferences;
    if (!prefs) return;
    setVisualsPreferred(prefs.visualsPreferred);
    setDailyNotification(prefs.dailyNotification);
    setTimezone(prefs.timezone ?? 'UTC');
  }, [meQ.data?.user.preferences]);

  if (meQ.isLoading) return <SettingsSkeleton />;

  if (meQ.isError || !meQ.data) {
    return (
      <div className="mx-auto w-full max-w-2xl p-4 sm:p-6 lg:p-8">
        <div className="rounded-2xl border border-line bg-bg-elev p-10 text-center">
          <p className="text-ink-2">Couldn&rsquo;t load your settings.</p>
          <Button variant="soft" className="mt-4" onClick={() => meQ.refetch()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const user = meQ.data.user;
  const saveDisabled = updateMut.isPending;

  return (
    <div className="mx-auto w-full max-w-2xl p-4 sm:p-6 lg:p-8">
      <div className="flex items-center gap-3">
        <span className="grid size-11 place-items-center rounded-2xl bg-primary-soft text-primary">
          <Settings className="size-5" />
        </span>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">{t('settings.title')}</h1>
          <p className="mt-1 text-sm text-ink-2">{t('settings.subtitle')}</p>
        </div>
      </div>

      <section className="mt-8 rounded-2xl border border-line bg-bg-elev p-6 shadow-soft">
        <h2 className="text-lg font-bold text-ink">{t('settings.profile')}</h2>
        <p className="mt-1 text-sm text-ink-2">Your account details.</p>
        <div className="mt-5 space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={user.email} readOnly className="mt-2 bg-bg-soft" />
          </div>
          <div>
            <Label htmlFor="tier">Plan</Label>
            <Input
              id="tier"
              value={user.tier.charAt(0).toUpperCase() + user.tier.slice(1)}
              readOnly
              className="mt-2 bg-bg-soft capitalize"
            />
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-line bg-bg-elev p-6 shadow-soft">
        <h2 className="text-lg font-bold text-ink">{t('settings.preferences')}</h2>
        <p className="mt-1 text-sm text-ink-2">Customize how you learn.</p>
        <div className="mt-5 space-y-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-medium text-ink">Visual aids in lessons</p>
              <p className="text-sm text-ink-2">Show diagrams and visual content when available.</p>
            </div>
            <Switch checked={visualsPreferred} onChange={setVisualsPreferred} />
          </div>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-medium text-ink">Daily reminder</p>
              <p className="text-sm text-ink-2">Get nudges to keep your learning streak alive.</p>
            </div>
            <Switch checked={dailyNotification} onChange={setDailyNotification} />
          </div>
          <div className="flex items-center justify-between gap-4 rounded-xl border border-line bg-bg-soft px-4 py-3">
            <div>
              <p className="font-medium text-ink">{t('settings.language')}</p>
              <p className="text-sm text-ink-2">{t('settings.languageHint')}</p>
            </div>
            <LanguageSelector compact />
          </div>
          <div>
            <Label htmlFor="timezone">Timezone</Label>
            <select
              id="timezone"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="mt-2 w-full rounded-xl border border-line bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-primary"
            >
              {TIMEZONES.map((tz) => (
                <option key={tz} value={tz}>
                  {tz}
                </option>
              ))}
            </select>
          </div>
        </div>
        {updateMut.isError ? (
          <p className="mt-4 text-sm text-bad">{mutationMessage(updateMut.error)}</p>
        ) : null}
        {updateMut.isSuccess ? (
          <p className="mt-4 text-sm text-good">Preferences saved.</p>
        ) : null}
        <Button
          className="mt-5"
          disabled={saveDisabled}
          onClick={() =>
            updateMut.mutate({
              visualsPreferred,
              dailyNotification,
              timezone,
            })
          }
        >
          {saveDisabled ? t('common.loading') : t('common.save')}
        </Button>
      </section>

      <section className="mt-6 rounded-2xl border border-line bg-bg-elev p-6 shadow-soft">
        <h2 className="text-lg font-bold text-ink">Privacy & data</h2>
        <p className="mt-1 text-sm text-ink-2">
          Download a copy of your data or permanently deactivate your account.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button
            variant="soft"
            disabled={exportMut.isPending}
            onClick={() => exportMut.mutate()}
          >
            <Download className="size-4" />
            {exportMut.isPending ? t('common.loading') : t('settings.exportData')}
          </Button>
        </div>
        {exportMut.isError ? (
          <p className="mt-3 text-sm text-bad">{mutationMessage(exportMut.error)}</p>
        ) : null}
      </section>

      <section className="mt-6 rounded-2xl border border-bad/20 bg-bad-soft/30 p-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 size-5 shrink-0 text-bad" />
          <div className="flex-1">
            <h2 className="text-lg font-bold text-ink">Delete account</h2>
            <p className="mt-1 text-sm text-ink-2">
              This deactivates your account. Your data will be permanently removed after the
              retention window.
            </p>
            {!confirmDelete ? (
              <Button
                variant="soft"
                className="mt-4 border border-bad/20 text-bad hover:bg-bad-soft"
                onClick={() => setConfirmDelete(true)}
              >
                <Trash2 className="size-4" />
                Delete my account
              </Button>
            ) : (
              <div className="mt-4 space-y-3">
                <p className="text-sm text-ink-2">
                  Type <strong>DELETE</strong> to confirm.
                </p>
                <Input
                  value={deletePhrase}
                  onChange={(e) => setDeletePhrase(e.target.value)}
                  placeholder="DELETE"
                />
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="soft"
                    className="border border-bad/20 text-bad hover:bg-bad-soft"
                    disabled={deleteMut.isPending || deletePhrase !== 'DELETE'}
                    onClick={() => deleteMut.mutate()}
                  >
                    {deleteMut.isPending ? 'Deleting…' : 'Confirm delete'}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setConfirmDelete(false);
                      setDeletePhrase('');
                    }}
                  >
                    Cancel
                  </Button>
                </div>
                {deleteMut.isError ? (
                  <p className="text-sm text-bad">{mutationMessage(deleteMut.error)}</p>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default SettingsPage;

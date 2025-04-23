import { dualEntryLazyLibrary } from '@nx-repro/dual-entry-lazy-library';

export async function mainLibrary(): Promise<string> {
  const lazyLoadedLibrary = await import('@nx-repro/lazy-loaded-library');
  const { secondary } = await import(
    '@nx-repro/dual-entry-lazy-library/secondary'
  );

  return (
    'main-library' +
    lazyLoadedLibrary.lazyLoadedLibrary() +
    secondary +
    dualEntryLazyLibrary()
  );
}

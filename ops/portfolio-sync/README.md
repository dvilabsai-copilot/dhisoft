# Portfolio sync on Hostinger

Edit the portfolio in `src/content/default-home-content.ts` for changes that
should ship with a release from `main`. Use the CMS editor for live overrides.

After the new Hostinger frontend passes its health checks, the deploy command
compares the new Git portfolio with the previously active release. It applies
changes to matching, untouched fields and adds new keys with unused slugs.
An edited or removed CMS project keeps the editor's decision. A project removed
in Git is removed from the CMS only if its CMS copy still matches the previous
Git copy. Conflicts appear in the deployment log.

Published content and pending drafts are merged separately. Updates take place
in one transaction with revision and audit records. The pre-change homepage is
backed up under `/srv/dhisoft-live/cms/portfolio-sync-backups`.

The Hostinger operator installs the reviewed hook once using
`sudo python3 ops/portfolio-sync/install-host-hook.py` from a trusted copy on
the server. Review and reinstall when the hook itself changes. Frontend
releases export JSON under the web account. The separately installed CMS
writer alone uses the CMS service environment.

Run the merge tests with `node --test ops/portfolio-sync/merge.test.cjs`.

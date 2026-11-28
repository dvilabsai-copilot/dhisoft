"""Install the reviewed Hostinger hook without granting the web deploy account CMS access."""

import fcntl
import os
import pwd
import shutil
import tempfile
from pathlib import Path


TOOLS = Path("/usr/local/lib/dhisoft-portfolio-sync")
DEPLOY = Path("/usr/local/sbin/dhisoft-live-deploy")
OPS = Path("/srv/dhisoft-live/ci")
BACKUPS = Path("/srv/dhisoft-live/cms/portfolio-sync-backups")
SOURCE = Path(__file__).resolve().parent
IMPORT = "import runpy\n"
CALL = (
    '                if app == "web":\n'
    '                    hook = runpy.run_path("/usr/local/lib/dhisoft-portfolio-sync/host-hook.py")\n'
    '                    hook["sync_web_portfolio"](previous, release)\n'
)


def install():
    if os.getuid() != 0:
        raise PermissionError("Run this installer as the Hostinger operator.")
    os.umask(0o077)
    with (OPS / "build.lock").open("a") as lock:
        fcntl.flock(lock, fcntl.LOCK_EX)
        original = DEPLOY.read_text()
        updated = original
        if CALL not in updated:
            marker = "                verify(app)\n            except BaseException:\n"
            if updated.count(marker) != 1 or updated.count("import re\n") != 1:
                raise ValueError("The Hostinger deployment command does not match the expected layout.")
            updated = updated.replace("import re\n", "import re\n" + IMPORT)
            updated = updated.replace(marker, "                verify(app)\n" + CALL + "            except BaseException:\n")
        compile(updated, str(DEPLOY), "exec")
        compile((SOURCE / "host-hook.py").read_text(), "host-hook.py", "exec")

        account = pwd.getpwnam("dhisoft-live-cms")
        BACKUPS.mkdir(mode=0o700, exist_ok=True)
        os.chown(BACKUPS, account.pw_uid, account.pw_gid)
        BACKUPS.chmod(0o700)
        TOOLS.mkdir(mode=0o755, exist_ok=True)
        TOOLS.chmod(0o755)
        for name in ("sync.cjs", "merge.cjs", "export.cjs", "host-hook.py"):
            shutil.copyfile(SOURCE / name, TOOLS / name)
            (TOOLS / name).chmod(0o644)
        if updated != original:
            backup = Path(tempfile.mkdtemp(prefix="portfolio-deploy-config.", dir=OPS))
            shutil.copy2(DEPLOY, backup / DEPLOY.name)
            with tempfile.NamedTemporaryFile(mode="w", dir=DEPLOY.parent, delete=False) as staged:
                staged.write(updated)
                os.chmod(staged.name, 0o755)
            os.replace(staged.name, DEPLOY)
            print(f"Installed the Hostinger portfolio hook. Previous command saved in {backup}.")
        else:
            print("Updated the installed Hostinger portfolio tools.")


if __name__ == "__main__":
    install()

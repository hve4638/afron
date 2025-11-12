import * as os from 'node:os';
import { exec } from 'child_process';

export function showMessage(...message: unknown[]) {
  const platform = os.platform();
  const escaped = message.map(m => String(m)).join(' ').replace(/'/g, "''"); // 작은따옴표 이스케이프

  switch (platform) {
    case 'win32':
      const command = `powershell -Command "Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.MessageBox]::Show('${escaped}', '디버그')"`;
      exec(command);
      break;
    case 'darwin':
      exec(`osascript -e 'display dialog "${escaped}" with title "디버그"'`);
      break;
  }

}
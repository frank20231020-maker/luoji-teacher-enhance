import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SKILLS_DIR = path.join(__dirname, '../skills');

/** Skill 文件名注册表，后续扩展在此追加 */
const SKILL_FILES = {
  luojiTeacher: 'luoji-teacher-skill.md',
};

/**
 * 读取 Skill Markdown 内容
 * @param {keyof typeof SKILL_FILES} [skillKey='luojiTeacher']
 * @returns {string}
 */
function loadSkill(skillKey = 'luojiTeacher') {
  try {
    const fileName = SKILL_FILES[skillKey];
    if (!fileName) return '';

    const filePath = path.join(SKILLS_DIR, fileName);
    return fs.readFileSync(filePath, 'utf8');
  } catch {
    return '';
  }
}

export { loadSkill };

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_SKILLS_DIR = path.join(__dirname, '../skills');
const GLOBAL_SKILLS_DIR = path.join('/Users', 'fl', 'Documents', 'ai-skills');

/** Skill 文件名注册表，后续扩展在此追加 */
const SKILL_FILES = {
  luojiTeacher: 'luoji-teacher-skill.md',
};

function resolveSkillFileName(skillName) {
  if (SKILL_FILES[skillName]) return SKILL_FILES[skillName];
  if (skillName.endsWith('.md')) return skillName;
  if (skillName.endsWith('-skill')) return `${skillName}.md`;
  return `${skillName}-skill.md`;
}

function readSkillFile(type, filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`[Skill] type: ${type}, path: ${filePath}, success: false`);
      return '';
    }

    const content = fs.readFileSync(filePath, 'utf8');
    console.log(`[Skill] type: ${type}, path: ${filePath}, success: true`);
    return content;
  } catch {
    console.log(`[Skill] type: ${type}, path: ${filePath}, success: false`);
    return '';
  }
}

/**
 * 读取 Skill Markdown 内容。
 *
 * 项目级 Skill：存放在当前项目的 server/skills/ 目录，用于承载本项目强相关的
 * 教师人设、表达风格、业务规则等能力。
 *
 * 全局通用 Skill：存放在 /Users/fl/Documents/ai-skills/ 目录，用于多个项目复用
 * 的通用能力，例如 deploy-release-skill 这类部署发布流程，不应该复制到每个项目。
 *
 * 项目级 Skill 优先级更高，因为它更贴近当前产品语境，能够覆盖同名全局 Skill，
 * 避免通用规则冲淡罗辑老师项目的教学风格和业务约束。
 *
 * @param {string} [skillKey='luojiTeacher']
 * @returns {string}
 */
function loadSkill(skillKey = 'luojiTeacher') {
  const fileName = resolveSkillFileName(skillKey);
  const projectSkillPath = path.join(PROJECT_SKILLS_DIR, fileName);
  const globalSkillPath = path.join(GLOBAL_SKILLS_DIR, fileName);

  return (
    readSkillFile('project skill', projectSkillPath) ||
    readSkillFile('global skill', globalSkillPath)
  );
}

export { loadSkill };

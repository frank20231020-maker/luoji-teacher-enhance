import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, TextRun } from 'docx';

export function downloadTxt(content, filename = '罗辑老师优化讲稿.txt') {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  saveAs(blob, filename);
}

export async function downloadDocx(content, filename = '罗辑老师优化讲稿.docx') {
  const paragraphs = content.split(/\n/).map(
    (line) =>
      new Paragraph({
        children: [
          new TextRun({
            text: line || ' ',
            font: 'Noto Sans SC',
            size: 24,
          }),
        ],
        spacing: { after: 120, line: 360 },
      })
  );

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: paragraphs.length ? paragraphs : [new Paragraph({ children: [new TextRun(' ')] })],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, filename);
}

export async function copyToClipboard(text) {
  await navigator.clipboard.writeText(text);
}

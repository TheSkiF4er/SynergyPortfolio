import dayjs from 'dayjs';
import { nanoid } from 'nanoid';

const startedAt = dayjs();
const demoId = nanoid(8);

export default function App() {
  return (
    <main className="card">
      <p className="eyebrow">Практическое задание 02</p>
      <h1>Create React App и npm-библиотеки</h1>
      <dl>
        <div><dt>Day.js</dt><dd>{startedAt.format('DD.MM.YYYY HH:mm:ss')}</dd></div>
        <div><dt>Nanoid</dt><dd><code>{demoId}</code></dd></div>
      </dl>
      <p>Приложение создано в структуре Create React App и использует две сторонние npm-библиотеки.</p>
    </main>
  );
}

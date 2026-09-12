import { useEffect, useState } from 'react';

const currencies = ['EUR','CHF','NOK','CAD','RUB','GBP','MXN','CNY','ISK','KRW','HKD','CZK','BGN','BRL','USD','IDR','SGD','PHP','RON','HUF','ILS','THB','SEK','NZD','AUD','DKK','PLN','TRY','INR','MYR','ZAR','JPY'];

function TextField({ label, name, type = 'text', value, onChange, ...inputProps }) {
  return <label className="card field"><span>{label}</span><input {...inputProps} required name={name} type={type} value={value} onChange={e => onChange(e.target.value)} /></label>;
}

function MessageField({ value, onChange }) {
  return <label className="card field"><span>Сообщение</span><textarea required name="message" rows="5" value={value} onChange={e => onChange(e.target.value)} /></label>;
}

function CurrencyCalculator({ value, onChange }) {
  const [rate, setRate] = useState(null);
  const [error, setError] = useState('');
  const { from, to, amount } = value;

  useEffect(() => {
    if (from === to) { setRate(1); setError(''); return; }
    const controller = new AbortController();
    setError('');
    setRate(null);
    fetch(`https://api.frankfurter.app/latest?from=${from}&to=${to}`, { signal: controller.signal })
      .then(r => { if (!r.ok) throw Error(`HTTP ${r.status}`); return r.json(); })
      .then(data => setRate(data.rates[to]))
      .catch(err => { if (err.name !== 'AbortError') setError(err.message); });
    return () => controller.abort();
  }, [from, to]);

  const result = rate == null ? null : amount * rate;
  return <fieldset className="card currency"><legend>Калькулятор валют</legend><div className="row">
    <label>Из<select name="currencyFrom" value={from} onChange={e => onChange({ ...value, from: e.target.value })}>{currencies.map(x => <option key={x}>{x}</option>)}</select></label>
    <label>В<select name="currencyTo" value={to} onChange={e => onChange({ ...value, to: e.target.value })}>{currencies.map(x => <option key={x}>{x}</option>)}</select></label>
    <label>Сумма<input required name="amount" type="number" min="0.01" step="0.01" value={amount} onChange={e => onChange({ ...value, amount: Number(e.target.value) })} /></label>
  </div>{error ? <p role="alert">Ошибка загрузки курса: {error}</p> : <p>Курс: {rate ?? '…'}; результат: {result == null ? '…' : result.toFixed(2)} {to}</p>}
    <input type="hidden" name="rate" value={rate ?? ''} /><input type="hidden" name="convertedAmount" value={result ?? ''} />
  </fieldset>;
}

function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [currency, setCurrency] = useState({ from: 'USD', to: 'RUB', amount: 100 });
  const [status, setStatus] = useState('');

  const submit = async e => {
    e.preventDefault();
    setStatus('Отправка…');
    const formData = new FormData(e.currentTarget);
    try {
      const response = await fetch('https://httpbin.org/post', { method: 'POST', body: formData });
      if (!response.ok) throw Error(`HTTP ${response.status}`);
      setStatus('Заявка успешно отправлена.');
      setName(''); setEmail(''); setMessage('');
    } catch (err) { setStatus(`Ошибка отправки: ${err.message}`); }
  };

  return <form onSubmit={submit} className="form"><h1>Заявка на обмен валюты</h1>
    <CurrencyCalculator value={currency} onChange={setCurrency} />
    <TextField label="Имя" name="name" value={name} onChange={setName} minLength="2" />
    <TextField label="Email" name="email" type="email" value={email} onChange={setEmail} />
    <MessageField value={message} onChange={setMessage} />
    <button type="submit">Отправить заявку</button><p aria-live="polite">{status}</p>
  </form>;
}

export default function App() { return <main><ContactForm /></main>; }

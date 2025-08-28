import ModularConstructor from '../../components/constructor/ModularConstructor';

export default function ConstructorPage() {
  return (
    <div>
      <div style={{ padding: '20px', textAlign: 'center', background: '#f5f5f5' }}>
        <h1>Онлайн-конструктор модульных домов</h1>
        <p>Создайте проект своего дома за 4 простых шага</p>
      </div>
      <ModularConstructor />
    </div>
  );
}
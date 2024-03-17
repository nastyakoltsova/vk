import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface CatFact {
  fact: string;
}

interface AgeResponse {
  age: number;
}

const App: React.FC = () => {
  const [catFact, setCatFact] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [userAge, setUserAge] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  let timeout: NodeJS.Timeout | null = null;

  const fetchCatFact = async () => {
    try {
      const response = await axios.get<CatFact>('https://catfact.ninja/fact');
      setCatFact(response.data.fact);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const inputField = document.getElementById('catFactInput') as HTMLInputElement;
    inputField.focus();

    const firstSpaceIndex = catFact.indexOf(' ');
    if (firstSpaceIndex !== -1) {
      inputField.setSelectionRange(firstSpaceIndex + 1, firstSpaceIndex + 1);
    }
  }, [catFact]);


  const fetchUserAge = async (name: string) => {
    setLoading(true);
    try {
      const response = await axios.get<AgeResponse>(
          `https://api.agify.io/?name=${name}`
      );
      setUserAge(response.data.age);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setUserName(value);
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      fetchUserAge(value);
    }, 3000);
  };

  const handleUserNameSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!userName.trim()) return;
    if (timeout) {
      clearTimeout(timeout);
    }
    fetchUserAge(userName);
  };

  useEffect(() => {
    fetchCatFact();
  }, []);

  return (
      <div>
        <div>
          <h2>Cat Fact</h2>
          <input
              style={{width: '700px'}}
              type="text"
              value={catFact}
              id="catFactInput"
              onClick={(e) => (e.target as HTMLInputElement).select()}
          />
          <button onClick={fetchCatFact}>Узнать факт</button>
        </div>
        <div>
          <h2>Возраст</h2>
          <form onSubmit={handleUserNameSubmit}>
            <input
                style={{ width: '700px' }}
                type="text"
                value={userName}
                onChange={handleUserNameChange}
                placeholder="Введите имя"
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Загрузка...' : 'Узнать возраст'}
            </button>
          </form>
          {userAge !== null && (
              <p>
                Возраст человека с именем {userName}: {userAge}
              </p>
          )}
        </div>
      </div>
  );
};

export default App;

import type { Component } from 'solid-js';

import logo from './logo.svg';
import styles from './App.module.css';

const App: Component = () => {
  return (
    <div class={styles.App}>
      <header class={styles.header}>
        <img src={chrome.runtime.getURL(logo)}
          class={styles.logo} alt="logo" />
        <p>
          Normal
        </p>
        <button
          class={styles.link}
        >
          Learn Solid
        </button>
      </header>
    </div>
  );
};

export default App;

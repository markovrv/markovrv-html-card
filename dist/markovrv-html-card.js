import { LitElement, html, css } from "https://unpkg.com/lit@2.6.1?module";
import { unsafeHTML } from "https://unpkg.com/lit@2.6.1/directives/unsafe-html.js?module";

class MySimpleCard extends LitElement {
  static properties = {
    hass: {},      // Объект Home Assistant
    config: {},    // Конфигурация карточки
  };

  static styles = css`
    .card {
      background: var(--card-background-color, #ffffff);
      border-radius: 12px;
      padding: 16px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      color: var(--primary-text-color, #000000);
      font-family: Arial, sans-serif;
    }
    .header {
      font-size: 1.2em;
      margin-bottom: 12px;
      color: var(--accent-color);
    }
    .value {
      font-size: 1.5em;
      font-weight: bold;
    }
    button {
      background: var(--primary-color);
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      margin-top: 10px;
      cursor: pointer;
    }
  `;

  // Вызывается при обновлении конфигурации
  setConfig(config) {
    if (!config.entity) throw new Error("Не указана entity!");
    this.config = config;
  }

  // Обработчик клика по кнопке
  handleClick() {
    this.hass.callService("light", "toggle", {
      entity_id: this.config.entity,
    });
  }

  // Рендер HTML
  render() {
    if (!this.hass || !this.config) return html`<div>Loading...</div>`;

    const state = this.hass.states[this.config.entity];
    if (!state) return html`<div>Entity not found!</div>`;

    return html`
      <div class="card">
        <div class="header">${this.config.title || "Custom Card"}</div>
        <div class="value">${state.state} ${this.config.unit || ""}</div>
        ${this.config.show_button ? html`
          <button @click=${this.handleClick}>Toggle</button>
        ` : ""}
      </div>
    `;
  }
}

// Регистрируем карточку в HA
customElements.define("my-simple-card", MySimpleCard);
// ==UserScript==
// @name          Get DLC List from SteamDB
// @description   Get DLC List from SteamDB
// @author        JNCJcoder
// @version       1.0.10
// @homepageURL   https://github.com/JNCJcoder/GetDLCListFromSteamDB/
// @updateURL     https://github.com/JNCJcoder/GetDLCListFromSteamDB/raw/master/GetDLCListFromSteamDB.user.js
// @downloadURL   https://github.com/JNCJcoder/GetDLCListFromSteamDB/raw/master/GetDLCListFromSteamDB.user.js
// @match         *://steamdb.info/app/*
// @run-at        document-end
// ==/UserScript==

class Main {
  constructor() {
    this.modal = document.createElement("div");
    this.button = document.createElement("a");
    this.selected = null;
    this.textArea = null;
    this.dlcs = [];

    this.CreateStyle();
    this.CreateButton();
    this.CreateModal();
    this.CreateEventListener();
  }

  CreateStyle() {
    const style = document.createElement("style");
    style.type = "text/css";
    style.innerHTML = `/* Button */
  .btn-fixed {
    position: fixed;
    bottom: 0;
    right: 10px;
    z-index: 4;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }

  /* Modal */

  .modal-wrapper {
    position: fixed;
    display: none;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 4;
    background: rgba(0, 0, 0, .75);
  }

  .modal {
    position: relative;
    padding: 20px;
    margin: 7% auto;
    max-width: 50%;
    font-family: arial;
    text-align: center;
    background-color: var(--body-bg-color);
    border: 1px solid var(--border-color);
    border-radius: 6px;
  }

  .modal-close {
      position: absolute;
      top: -12px;
      right: -12px;
      width: 30px;
      height: 20px;
      padding: 0px;
      font-weight: 1000;
      font-size: 16px;
      background-color: var(--body-bg-color);
      color: var(--link-color);
      border-radius: 10px;
  }

  .modal-close:hover {
    background-color: var(--body-bg-color);
    color: var(--link-color-hover);
  }

  .modal-content {
    padding: 10px;
    margin-bottom: 10px;
    border-top: 1px solid;
    border-bottom: 1px solid;
    border-color: #323f53;
  }

  #selectList {
    width: 35%;
  }

  #DLCList {
    width: 100%;
    resize: none;
  }`;

    document.head.appendChild(style);
  }

  CreateButton() {
    this.button.setAttribute("class", "btn btn-primary btn-fixed");
    this.button.innerHTML =
      `<svg version="1.1" width="16" height="16" viewBox="0 0 16 16" class="octicon octicon-package" aria-hidden="true">
          <path fill-rule="evenodd" d="M8.878.392a1.75 1.75 0 00-1.756 0l-5.25 3.045A1.75 1.75 0 001 4.951v6.098c0 .624.332 1.2.872 1.514l5.25 3.045a1.75 1.75 0 001.756 0l5.25-3.045c.54-.313.872-.89.872-1.514V4.951c0-.624-.332-1.2-.872-1.514L8.878.392zM7.875 1.69a.25.25 0 01.25 0l4.63 2.685L8 7.133 3.245 4.375l4.63-2.685zM2.5 5.677v5.372c0 .09.047.171.125.216l4.625 2.683V8.432L2.5 5.677zm6.25 8.271l4.625-2.683a.25.25 0 00.125-.216V5.677L8.75 8.432v5.516z">
          </path>
        </svg> Get DLC List from SteamDB`;

    document.body.appendChild(this.button);
  }

  CreateModal() {
    this.modal.setAttribute("class", "modal-wrapper");
    this.modal.innerHTML = `<div class="modal">
      <a class="btn modal-close" id="modal-close">X</a>
      <div class="modal-header">
        <h3>Get DLC List from SteamDB <b>v1.0.10</b> <small>by JNCJcoder</small></h3>
      </div>
      <div class="modal-content">
        <select id="selectList">
          <option value="CreamAPI">CreamAPI</option>
          <option value="SKIDROW">SKIDROW</option>
          <option value="3DMGAME">3DMGAME</option>
          <option value="CODEX">CODEX</option>
          <option value="LUMAEMU">LUMAEMU</option>
        </select>
        <button id="GetList" class="btn btn-primary" type="button">Get List!</button>
        <button id="CopyText" class="btn btn-primary" type="button" style="background-color: #fff; color: #000;">Copy</button>
      </div>
      <div class="modal-textarea">
        <textarea id="DLCList" rows="20" placeholder="Select a option above."></textarea>
      </div>
    </div>
    </div>`;

    document.body.appendChild(this.modal);
    this.textArea = document.getElementById("DLCList");
    this.selected = document.getElementById("selectList");
  }

  CreateEventListener() {
    this.button.addEventListener("click", () => {
      this.modal.style.display = "block";
      this.button.style.display = "none";
    });

    document.addEventListener("click", (event) => {
      switch (event.target.id) {
        case "modal-close":
          this.modal.style.display = "none";
          this.button.style.display = "block";
          break;

        case "GetList":
          this.PopulateDLCList();
          this.GetList();
          break;

        case "CopyText":
          this.textArea.select();
          document.execCommand("copy");
          break;

        default:
          break;
      }
    });
  }

  PopulateDLCList() {
    if (this.dlcs.length !== 0) return;

    const dlcTable = [...document.getElementsByClassName("app")]
      .filter(dlc => !(dlc.href || dlc.textContent.includes("SteamDB")))
      .map(dlc => {
        const [ appID, name ] = dlc.innerText.split("\t");
        
        return { appID, name };
      });

    this.dlcs = dlcTable;
  }

  GetList() {
    const formatList = {
      "CreamAPI": (accumulator, dlc) => `${accumulator}${dlc.appID} = ${dlc.name}\n`,
      "SKIDROW": (accumulator, dlc) => `${accumulator}; ${dlc.name}\n${dlc.appID}\n`,
      "3DMGAME": (accumulator, dlc, index) => `${accumulator}; ${dlc.name}\nDLC00${index + 1} = ${dlc.appID}\n`,
      "CODEX": (accumulator, dlc, index) => `${accumulator}DLC0000${index} = ${dlc.appID}\nDLCName0000${index} = ${dlc.name}\n`,
      "LUMAEMU": (accumulator, dlc) => `${accumulator}; ${dlc.name}\nDLC_${dlc.appID} = 1\n`
    }

    this.textArea.value = this.dlcs.reduce(formatList[this.selected.value], "");
  }
}

const program = new Main();
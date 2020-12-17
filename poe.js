class Character {
  constructor(name, ascendancy, league) {
    this.name = name;
    this.ascendancy = ascendancy;
    this.league = league;
  }
}

// Character List

const charactersArray = [];
const filter = {
  name: "",
  ascendancy: "",
  league: "",
};

// Listen to DOM changes and get characters when loaded

const MutationObserver =
  window.MutationObserver || window.WebKitMutationObserver;

var observer = new MutationObserver(function (mutations) {
  (mutations || []).forEach(function (mutation) {
    const classList = mutation.target.classList;
    const isCharacterList = classList.contains("characters");
    if (isCharacterList) {
      console.log("characters loaded");
      setCharacters();
    }
  });
});

observer.observe(document, {
  subtree: true,
  attributes: true,
});

// Fetch Characters

function setCharacters() {
  var charactersNode = getCharacterHTMLList();
  var characters = charactersNode[0] || null;
  charactersArray.length = 0;

  (Array.from(characters.children) || []).forEach(function (child) {
    const char = getCharacterFromNode(child);
    char && charactersArray.push(char);
  });

  if (charactersArray.length > 0) {
    appendInputs();
  }
}

function getCharacterFromNode(node) {
  const name = node.getElementsByClassName("infoLine1")[0]?.innerText;
  const ascendancy = node
    .getElementsByClassName("infoLine2")[0]
    ?.innerText.split(" ")[2];
  const league = node.getElementsByClassName("infoLine3")[0]?.innerText;

  if (name && ascendancy && league) {
    return new Character(name, ascendancy, league);
  } else {
    return null;
  }
}

// Append Elements

function appendInputs() {
  var nodeParent = document.getElementsByClassName("container-content");
  if (nodeParent[0]) {
    var nodeToAppend = nodeParent[0].firstElementChild;

    if (nodeToAppend.nextSibling.nodeName !== "INPUT") {
      observer.disconnect();

      // Input Search

      const search = document.createElement("input");
      search.setAttribute("type", "text");
      search.setAttribute("placeholder", "Search by Name");
      search.addEventListener("input", (event) => {
        filter.name = event.target.value.toLowerCase();
        filterCharacters();
      });
      nodeToAppend && nodeToAppend.insertAdjacentElement("afterend", search);

      // Ascendency select

      const ascSelect = document.createElement("select");
      const ascendancies = getAscendancies();
      if (ascendancies.length > 0) {
        const option = document.createElement("option");
        option.value = "";
        option.text = "All Ascendencies";
        ascSelect.appendChild(option);

        ascendancies.forEach(function (ascendancy) {
          const option = document.createElement("option");
          option.value = ascendancy;
          option.text = ascendancy;
          ascSelect.appendChild(option);
        });
      }

      ascSelect.addEventListener("change", (event) => {
        filter.ascendancy = event.target.value;
        filterCharacters();
      });
      search.insertAdjacentElement("afterend", ascSelect);

      // League select

      const select = document.createElement("select");
      const leagues = getLeagues();
      if (leagues.length > 0) {
        const option = document.createElement("option");
        option.value = "";
        option.text = "All Leagues";
        select.appendChild(option);

        leagues.forEach(function (league) {
          const option = document.createElement("option");
          option.value = league;
          option.text = league;
          select.appendChild(option);
        });
      }

      select.addEventListener("change", (event) => {
        filter.league = event.target.value;
        filterCharacters();
      });
      ascSelect.insertAdjacentElement("afterend", select);
    }
  }
}

// Input onchange

function filterCharacters() {
  try {
    var characterList = getCharacterHTMLList()[0].children;

    Array.from(characterList || []).forEach(function (character, index) {
      const name = charactersArray[index].name.toLowerCase();
      const league = charactersArray[index].league;
      const ascendancy = charactersArray[index].ascendancy;

      if (filter.name != "" || filter.league != "" || filter.ascendancy != "") {
        if (filter.ascendancy != "" && filter.ascendancy !== ascendancy) {
          hideElement(character);
        } else {
          showElement(character);
          if (filter.league != "" && filter.league !== league) {
            hideElement(character);
          } else {
            showElement(character);
            if (filter.name != "" && !name.includes(filter.name)) {
              hideElement(character);
            } else {
              showElement(character);
            }
          }
        }
      } else if (
        filter.name === "" &&
        filter.league === "" &&
        filter.ascendancy === ""
      ) {
        showElement(character);
      }
    });
  } catch (e) {
    console.error(e);
  }
}

// Helper Functions

function getCharacterHTMLList() {
  return document.querySelectorAll("ul.characters");
}

function hideElement(node) {
  node.style.display = "none";
}

function showElement(node) {
  node.style.display = "list-item";
}

function getAscendancies() {
  const uniques = [
    ...new Set((charactersArray || []).map((char) => char.ascendancy)),
  ];
  return uniques;
}

function getLeagues() {
  const uniques = [
    ...new Set((charactersArray || []).map((char) => char.league)),
  ];
  return uniques;
}

// Global variables for sorting.
let newSort = null;
let showPast = null;

document.addEventListener('DOMContentLoaded', () => {
  const newButton = document.querySelector('#new-roster-button');
  const newRoster = document.querySelector('.new-roster');
  const newRosterForm = document.querySelector('.new-roster-form');
  const sort = document.querySelector('#rosters-sort');
  const past = document.querySelector('#rosters-show-past-events');
  const errorList = document.querySelector('.error-list');
  const rosterEventName = document.querySelector('#roster-event-name');
  const rosterStartDate = document.querySelector('#roster-start-date');
  const rosterEndDate = document.querySelector('#roster-end-date');
  const rosterLocation = document.querySelector('#roster-location');
  const rosterDetails = document.querySelector('#roster-details');
  const rosterSkipper = document.querySelector('#boat-skipper');
  const rosterCrew = document.querySelector('#boat-crew');
  const rosterBoat = document.querySelector('#boat-boat');
  const rosterSailNumber = document.querySelector('#boat-sail-number');
  const rosterButton = document.querySelector('#submit-new-roster-button');
  const tbody = document.querySelector('.new-roster-table > tbody');

  // Load rosters
  Roster.get(newSort, showPast);

  // Make NodeList iterable.
  NodeList.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator];
  // Make HTMLCollection iterable.
  HTMLCollection.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator];

  // Toggle New Roster form.
  if (newButton) {
    newButton.addEventListener('click', event => {
      if (window.getComputedStyle(newRoster).getPropertyValue('display') === 'none') {
        newRoster.style.display = 'block';
        newButton.textContent = 'Close';
      } else {
        newRoster.style.display = 'none';
        const i = document.createElement('i');
        i.classList.add('fa');
        i.classList.add('fa-plus');
        const text = document.createTextNode('New');
        newButton.textContent = '';
        newButton.appendChild(i);
        newButton.appendChild(text);
      }
    });
  }

  // Sort change handler.
  sort.addEventListener('change', event => {
    newSort = sort.value;
    Roster.get(newSort, showPast);
  });

  past.addEventListener('change', event =>{
    showPast = past.checked;
    Roster.get(newSort, showPast);
  });

  // New Roster submit handler.
  newRosterForm.addEventListener('submit', event => {
    event.preventDefault();

    clearError(errorList);

    // Validate event data.
    let invalid = isValidForm([
      [rosterEventName, 'event name'],
      [rosterStartDate, 'start date'],
      [rosterEndDate, 'end date'],
      [rosterLocation, 'location'],
      [rosterDetails, 'details']
    ], errorList);

    // Validate boat data.
    let invalidElements = [];
    for (const tr of tbody.children) {
      for (const td of tr.children) {
        const input = td.children[0];
        if (!input.checkValidity()) {
          invalidElements.push(input);
          invalid = true;
        }
      }
    }

    if (invalidElements.length !== 0) {
      showError(errorList, invalidElements, 'Boat data cannot be missing.')
    }

    if (invalid) {
      event.preventDefault();
    } else {
      rosterButton.textContent = 'Submitting...';
      rosterButton.style.width = 'auto';
      rosterButton.disabled = true;

      function getRowValues(tr) {
        let row = [];
        for (const td of tr.children) {
          row.push(td.children[0].value);
        }
        return {
          skipper: row[0],
          crew: row[1],
          boat: row[2],
          sail_number: row[3]
        };
      }

      const nonEmptyRows = Array.from(tbody.children).filter(tr => Array.from(tr.children).map(x => x.children[0].value).some(x => x !== '')); // TODO: Change this when bug fixed.
      const boats = nonEmptyRows.map(tr => getRowValues(tr));

      Roster.post({
        name: rosterEventName.value,
        start_date: rosterStartDate.value,
        end_date: rosterEndDate.value,
        location: rosterLocation.value,
        details: rosterDetails.value,
        boats: boats
      }).then(() => {
        newRosterForm.reset();
        rosterEventName.focus();
        rosterStartDate.focus();
        rosterEndDate.focus();
        rosterLocation.focus(); // Safari 10.0 bug.
        newButton.click();
      }).catch(err => {
        console.log(err);
        window.a = err;
        alert(`Could not add roster. Error: ${err.message}`);
      }).then(() => {
        // Always reset submit button.
        rosterButton.textContent = 'Submit';
        rosterButton.style.width = '';
        rosterButton.disabled = false;
      });
    }
  })

  // Add event handlers to boat input.
  rosterSkipper.addEventListener('input', handleBoatInput);
  rosterCrew.addEventListener('input', handleBoatInput);
  rosterBoat.addEventListener('input', handleBoatInput);
  rosterSailNumber.addEventListener('input', handleBoatInput);

  // Event handler for boat input.
  function handleBoatInput(event) {
    const rosterSkipper = event.target;
    const tr = rosterSkipper.parentElement.parentElement;
    const valuesOfRow = Array.from(tr.children).map(x => x.children[0].value);

    // TODO: Fix bug - when user clears second from last row, then last row,
    // there are two empty rows.

    // If user has entered some text into the row.
    if (valuesOfRow.some(x => x !== '')) {
      const nextRow = tr.nextElementSibling;
      // If last row, add a new row.
      if (nextRow === null) {
        tbody.appendChild(makeBoatRow());
      }

      // Ensure the rest of the row is also filled.
      // tr.children is an HTMLCollection which isn't normally iterable.
      for (const td of tr.children) {
        const input = td.children[0];
        input.placeholder = 'Required';
        input.required = true;
      }
    } else { // If row empty.
      const nextRow = tr.nextElementSibling;
      const valuesOfNextRow = Array.from(nextRow.children).map(x => x.children[0].value);
      // If next row also empty, remove next row.
      if (!valuesOfNextRow.some(x => x !== '')) {
        tr.parentElement.lastChild.remove();
      }

      // Remove required restriction on row if not first row.
      if (tr.parentElement.children.length !== 1) {
        // tr.children is an HTMLCollection which isn't normally iterable.
        for (const td of tr.children) {
          const input = td.children[0];
          input.placeholder = '';
          input.required = false;
        }
      }
    }
  }

  function makeBoatRow() {
    const boatRow = document.createElement('tr');
    const skipper = document.createElement('td');
    const skipperI = document.createElement('input');
    skipperI.classList.add('boat-skipper');
    skipper.appendChild(skipperI);

    const crew = document.createElement('td');
    const crewI = document.createElement('input');
    crewI.classList.add('boat-crew');
    crew.appendChild(crewI);

    const boat = document.createElement('td');
    const boatI = document.createElement('input');
    boatI.classList.add('boat-boat');
    boat.appendChild(boatI);

    const sailNumber = document.createElement('td');
    const sailNumberI = document.createElement('input');
    sailNumberI.classList.add('boat-sailNumber');
    sailNumber.appendChild(sailNumberI);

    skipper.addEventListener('input', handleBoatInput);
    crew.addEventListener('input', handleBoatInput);
    boat.addEventListener('input', handleBoatInput);
    sailNumber.addEventListener('input', handleBoatInput);

    boatRow.appendChild(skipper);
    boatRow.appendChild(crew);
    boatRow.appendChild(boat);
    boatRow.appendChild(sailNumber);

    return boatRow;
  }
});

class Roster {
  constructor(data) {
    this.id = data.id;
    this.location = data.location;
    this.start_date = data.start_date;
    this.end_date = data.end_date;
    this.event_name = data.event_name;
    this.other_details = data.other_details;
    this.boats = data.boats;
  }

  display(userLevel) {
    const rosterItem = document.createElement('article');
    rosterItem.classList.add('roster-item');

    // Roster Event Header
    const rosterEventHeader = document.createElement('div');
    rosterEventHeader.classList.add('roster-event-header');

    const rosterEventName = document.createElement('h3');
    rosterEventName.classList.add('roster-event-name');
    rosterEventName.textContent = this.event_name;

    const rosterEventDate = document.createElement('h3');
    rosterEventDate.classList.add('roster-event-date');
    let dateText = `Date: ${this.start_date}`;
    if (this.end_date) {
      dateText += ` to ${this.end_date}`;
    }
    rosterEventDate.textContent = dateText;

    const rosterEventLocation = document.createElement('h3');
    rosterEventLocation.classList.add('roster-event-location');
    rosterEventLocation.textContent = `Location: ${this.location}`;

    const rosterEventDetail = document.createElement('p');
    rosterEventDetail.classList.add('roster-event-detail');
    rosterEventDetail.textContent = this.other_details;

    rosterEventHeader.appendChild(rosterEventName);
    rosterEventHeader.appendChild(rosterEventDate);
    rosterEventHeader.appendChild(rosterEventLocation);
    rosterEventHeader.appendChild(rosterEventDetail);

    rosterItem.appendChild(rosterEventHeader);

    // Roster Boat Data
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    const theadtr = document.createElement('tr');
    const theadthSkipper = document.createElement('th');
    theadthSkipper.textContent = 'Skipper';
    const theadthCrew = document.createElement('th');
    theadthCrew.textContent = 'Crew';
    const theadthBoat = document.createElement('th');
    theadthBoat.textContent = 'Boat';
    const theadthSailNumber = document.createElement('th');
    theadthSailNumber.textContent = 'Sail Number';

    theadtr.appendChild(theadthSkipper);
    theadtr.appendChild(theadthCrew);
    theadtr.appendChild(theadthBoat);
    theadtr.appendChild(theadthSailNumber);
    thead.appendChild(theadtr);
    table.appendChild(thead);
    rosterItem.appendChild(table);

    for (const boat of this.boats) {
      const tr = document.createElement('tr');
      const tdSkipper = document.createElement('td');
      tdSkipper.textContent = boat.skipper;
      const tdCrew = document.createElement('td');
      tdCrew.textContent = boat.crew;
      const tdBoat = document.createElement('td');
      tdBoat.textContent = boat.boat_name;
      const tdSailNumber = document.createElement('td');
      tdSailNumber.textContent = boat.sail_number;
      tr.appendChild(tdSkipper);
      tr.appendChild(tdCrew);
      tr.appendChild(tdBoat);
      tr.appendChild(tdSailNumber);
      tbody.appendChild(tr);
    }

    table.appendChild(tbody);
    rosterItem.appendChild(table);

    const actionsContainer = document.createElement('div');
    actionsContainer.classList.add('news-item-actions');

    const actionsUl = document.createElement('ul');
    const deleteLi = document.createElement('li');

    // Delete button.
    const deleteA = document.createElement('a');
    deleteA.classList.add('action-delete');
    deleteA.href = 'javascript: void 0;';
    deleteA.setAttribute('title', 'Delete');
    const deleteButton = document.createElement('i');
    deleteButton.classList.add('fa');
    deleteButton.classList.add('fa-trash');
    deleteButton.setAttribute('aria-hidden', 'true');
    deleteA.appendChild(deleteButton);
    const deleteText = document.createTextNode('Delete');
    deleteA.appendChild(deleteText);

    deleteLi.appendChild(deleteA);

    if (userLevel === 'admin') {
      actionsUl.appendChild(deleteLi);
    }

    actionsContainer.appendChild(actionsUl);

    rosterItem.appendChild(actionsContainer);

    document.querySelector('.rosters').appendChild(rosterItem);

    // Event handlers for actions container.
    deleteA.addEventListener('click', event => {
      event.preventDefault();
      if (confirm('Are you sure?')) {
        Roster.delete(this.id, rosterItem);
      }
    });
  }

  static get(sort, past) {
    past = past ? 'show' : 'hide';
    return fetch(`/api/rosters?sort=${sort || ''}&past=${past || ''}`, {
      credentials: 'include'
    }).then(res => {
      // Get JSON data from Response object.
      return res.json();
    }).then(rosters => {
      if (rosters.success) {
        console.log(rosters.data);
        const userLevel = rosters.data.user_level;
        rosters = rosters.data.data; // rosters: array of data objects.

        // Clear all rosters.
        const rostersSection = document.querySelector('.rosters');

        const rostersMessage = document.querySelector('.rosters-message');
        if (rostersMessage) {
          rostersSection.removeChild(rostersMessage);
        }

        let rosterItem = document.querySelector('.rosters .roster-item');
        while (rosterItem) {
          rostersSection.removeChild(rosterItem);
          rosterItem = document.querySelector('.rosters .roster-item');
        }

        if (rosters.length === 0) {
          const noRosters = document.createElement('p');
          noRosters.classList.add('rosters-message');
          noRosters.textContent = 'No rosters yet!';
          rostersSection.appendChild(noRosters);
        }

        // Display each new roster.
        for (const data of rosters) {
          const roster = new Roster(data);
          roster.display(userLevel);
        }
      } else {
        const rostersMessage = document.querySelector('.no-rosters-message');
        rostersMessage.textContent = 'Could not get rosters:', data.message;
      }
    }).catch(err => {
      console.log(err);
    });
  }

  static post(data) {
    return fetch('/api/rosters', {
      method: 'POST',
      credentials: 'include',
      headers: new Headers({'Content-Type': 'application/json'}),
      body: JSON.stringify(data)
    }).then(res => {
      // Get JSON data from Response object.
      return res.json();
    }).then(data => {
      console.log('success');
      if (data.success) {
        // Update news.
        return Roster.get(newSort, showPast);
      } else {
        throw new Error(data.message);
      }
    });
  }

  static put(data) {

  }

  static delete(id, elementToRemove) {
    return fetch(`/api/rosters/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    }).then(res => {
      // Get JSON data from Response object.
      return res.json();
    }).then(data => {
      if (data.success) {
        elementToRemove.remove();
      } else {
        alert(data.message);
        // alert('You shouldn\'t have done that.');
        // location.href = '//youtube.com/watch?v=dQw4w9WgXcQ';
      }
    });
  }
}

// Validate form and show errors.
function isValidForm(elementsToValidate, errorList) {
  let invalid = false;
  for (const tuple of elementsToValidate) {
    const [element, name] = tuple;
    if (!element.checkValidity()) {
      showError(errorList, element, getErrorMsg(name, element.validity));
      invalid = true;
    }
  }
  return invalid;
}

function clearError(ul) {
  while (ul.firstChild) {
    ul.removeChild(ul.firstChild);
  }
}

function showError(ul, element, text) {
  const item = document.createElement('li');
  item.textContent = text;
  ul.appendChild(item);

  if (Array.isArray(element)) {
    for (const el of element) {
      el.classList.add('invalid');
    }
  } else { // Should be an HTMLElement
    element.classList.add('invalid');
  }
}

function getErrorMsg(name, validity) {
  let message;
  switch (true) {
    case validity.valueMissing:
      message = `${name} cannot be empty.`;
      break;
    case validity.tooLong:
      message = `${name} too long.`;
      break;
    case validity.rangeOverflow:
      message = `${name} too big.`;
      break;
    case validity.rangeUnderflow:
      message = `${name} too small.`;
      break;
    default:
      message = `Invalid ${name}.`;

    return message;
  }

  return sentenceCase(message);
}

function sentenceCase(text) {
  return text[0].toUpperCase() + (text.slice(1)).toLowerCase();
}

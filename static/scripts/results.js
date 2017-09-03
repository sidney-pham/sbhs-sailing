let newSort = null;
document.addEventListener('DOMContentLoaded', () => {
  const newResult = document.querySelector('.new-result');
  const newResultForm = document.querySelector('.new-result-form');
  const errorList = document.querySelector('.error-list');
  const sort = document.querySelector('#results-sort');
  const resultEventName = document.querySelector('#result-event-name');
  const resultStartDate = document.querySelector('#result-start-date');
  const resultEndDate = document.querySelector('#result-end-date');
  const resultLocation = document.querySelector('#result-location');
  const resultDetails = document.querySelector('#result-details');
  const resultSkipper = document.querySelector('#boat-skipper');
  const resultCrew = document.querySelector('#boat-crew');
  const resultBoat = document.querySelector('#boat-boat');
  const resultSailNumber = document.querySelector('#boat-sail-number');
  const resultButton = document.querySelector('#submit-new-result-button');
  const tbody = document.querySelector('.new-result-table > tbody');

  newSort = sort.value;

  // Load results
  Result.get(newSort);

  // Make NodeList iterable.
  NodeList.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator];
  // Make HTMLCollection iterable.
  HTMLCollection.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator];

  // Sort change handler.
  sort.addEventListener('change', event => {
    newSort = sort.value;
    Result.get(newSort);
  });
});

class Result {
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
    const resultItem = document.createElement('article');
    resultItem.classList.add('result-item');

    // Result Event Header
    const resultEventHeader = document.createElement('div');
    resultEventHeader.classList.add('result-event-header');

    const resultEventName = document.createElement('h3');
    resultEventName.classList.add('result-event-name');
    resultEventName.textContent = this.event_name;

    const resultEventDate = document.createElement('h3');
    resultEventDate.classList.add('result-event-date');
    let dateText = `Date: ${this.start_date}`;
    if (this.end_date) {
      dateText += ` to ${this.end_date}`;
    }
    resultEventDate.textContent = dateText;

    const resultEventLocation = document.createElement('h3');
    resultEventLocation.classList.add('result-event-location');
    resultEventLocation.textContent = `Location: ${this.location}`;

    const resultEventDetail = document.createElement('p');
    resultEventDetail.classList.add('result-event-detail');
    resultEventDetail.textContent = this.other_details;

    const resultUnavailable = document.createElement('p');
    resultUnavailable.classList.add('result-unavailable-message');

    resultEventHeader.appendChild(resultEventName);
    resultEventHeader.appendChild(resultEventDate);
    resultEventHeader.appendChild(resultEventLocation);
    resultEventHeader.appendChild(resultEventDetail);
    resultEventHeader.appendChild(resultUnavailable);

    const editDiv = document.createElement('div');
    editDiv.classList.add('edit');
    resultItem.appendChild(resultEventHeader);
    resultItem.appendChild(editDiv);

    // Result Boat Data
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
    let max = 0;
    let displayFinalScore = false;
    for (const boat of this.boats) {
      if (boat.race_results) {
        if (boat.race_results.length > max) {
          max = boat.race_results.length;
        }
        displayFinalScore = true;
      }
    }
    for (let race = 1; race <= max; race++) {
      const th = document.createElement('th');
      th.textContent = `Race ${parseInt(race)}`;
      theadtr.appendChild(th);
    }

    if (displayFinalScore) {
      const finalScore = document.createElement('th');
      finalScore.textContent = 'Final Score';
      theadtr.appendChild(finalScore);
    } else {
      resultUnavailable.textContent = 'Results not available yet.';
    }
    thead.appendChild(theadtr);
    table.appendChild(thead);


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

      for (let race = 0; race < max; race++) {
        const td = document.createElement('td');
        const result = boat.race_results[race];
        td.textContent = result || '';
        tr.appendChild(td);
      }

      if (displayFinalScore) {
        const finalScore = document.createElement('td');
        finalScore.textContent = boat.overall;
        tr.appendChild(finalScore);
      }
      tbody.appendChild(tr);
      }

    table.appendChild(tbody);
    resultItem.appendChild(table);

    const actionsContainer = document.createElement('div');
    actionsContainer.classList.add('news-item-actions');

    const actionsUl = document.createElement('ul');
    const saveLi = document.createElement('li');
    saveLi.style.display = 'none';
    const editLi = document.createElement('li');
    const deleteLi = document.createElement('li');

    // Save button.
    const saveA = document.createElement('a');
    saveA.classList.add('action-save');
    saveA.href = 'javascript: void 0;';
    saveA.setAttribute('title', 'Save');
    const saveButton = document.createElement('i');
    saveButton.classList.add('fa');
    saveButton.classList.add('fa-save');
    saveButton.setAttribute('aria-hidden', 'true');
    saveA.appendChild(saveButton);
    const saveText = document.createTextNode('Save');
    saveA.appendChild(saveText);

    // Edit button.
    const editA = document.createElement('a');
    editA.classList.add('action-edit');
    editA.href = 'javascript: void 0;';
    editA.setAttribute('title', 'Edit');
    const editButton = document.createElement('i');
    editButton.classList.add('fa');
    editButton.classList.add('fa-pencil');
    editButton.setAttribute('aria-hidden', 'true');
    editA.appendChild(editButton);
    const editText = document.createTextNode('Edit');
    editA.appendChild(editText);

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
    const deleteText = document.createTextNode('Clear Results');
    deleteA.appendChild(deleteText);

    saveLi.appendChild(saveA);
    editLi.appendChild(editA);
    deleteLi.appendChild(deleteA);

    if (userLevel === 'admin') {
      actionsUl.appendChild(saveLi);
      actionsUl.appendChild(editLi);
      actionsUl.appendChild(deleteLi);
    }

    actionsContainer.appendChild(actionsUl);

    resultItem.appendChild(actionsContainer);

    // Event handlers for actions.
    let editShown = false;
    editA.addEventListener('click', event => {
      editButton.classList.toggle('fa-pencil');
      editButton.classList.toggle('fa-close');

      const editDiv = resultItem.querySelector('.edit');
      editShown = !editShown;
      if (editShown) {
        editText.textContent = 'Cancel';
        saveLi.style.display = '';

        const tbody = resultItem.querySelector('tbody');
        const editHeader = document.createElement('h4');
        editHeader.classList.add('edit-boats-header');
        editHeader.textContent = 'Edit Boats';
        const editUl = document.createElement('ul');
        editUl.classList.add('edit-list');
        editDiv.append(editHeader);
        for (const tr of tbody.children) {
          const editLi = document.createElement('li');
          const boat = tr.children[2].textContent;
          const label = document.createElement('label');
          label.textContent = boat;
          const input = document.createElement('input');
          input.classList.add('editing');
          input.classList.add('scores');
          input.type = 'text';
          input.placeholder = 'Race scores (comma separated)';
          input.required = true;
          input.pattern = /^[-\d\s]+(?:,[-\d\s]*)*$/.source;
          input.title = 'Comma separated integers, e.g., \'1,3,,2,,,4\'';
          const input2 = document.createElement('input');
          input2.classList.add('editing');
          input2.classList.add('final-score');
          input2.type = 'number';
          input2.placeholder = 'Final score';
          input2.required = true;
          input2.pattern = /^\d+$/.source;

          editLi.appendChild(label);
          editLi.appendChild(input);
          editLi.appendChild(input2);
          editUl.appendChild(editLi);
        }
        editDiv.appendChild(editUl);
        const errorList = document.createElement('ul');
        errorList.classList.add('error-list');

        editDiv.appendChild(errorList);

      } else {
        editText.textContent = 'Edit';
        saveLi.style.display = 'none';
        Array.from(resultItem.querySelectorAll('.edit > *')).map(x => x.remove());
      }
    });

    saveA.addEventListener('click', event => {
      event.preventDefault();

      const errorList = resultItem.querySelector('.error-list');
      clearError(errorList);

      let invalid = false;
      const editList = editDiv.querySelector('.edit-list');
      for (const el of editList.children) {
        const [label, raceScores, finalScore] = el.children;
        if (!raceScores.checkValidity()) {
          showError(errorList, raceScores, getErrorMsg(`race scores for '${label.textContent}'`, raceScores.validity))
          invalid = true;
        }

        if (!finalScore.checkValidity()) {
          showError(errorList, finalScore, getErrorMsg(`final score for '${label.textContent}'`, finalScore.validity))
          invalid = true;
        }
      }

      if (!invalid) {
        const x = resultItem.querySelectorAll('.scores');
        const y = resultItem.querySelectorAll('.final-score');
        const z = Array.from(x).map((elx, i) => [elx, y[i]]).map(xs => xs.map(x => x.value));
        Result.put({event_id: this.id, boats: z}).catch(err => {
          alert(err.message);
        });
      }
    });

    deleteA.addEventListener('click', event => {
      event.preventDefault();

      if (confirm('Are you sure?')) {
        Result.clear(this.id, resultItem);
      }
    });

    return resultItem;
  }

  static get(sort) {
    return fetch(`/api/results?sort=${sort || ''}`, {
      credentials: 'include'
    }).then(res => {
      // Get JSON data from Response object.
      return res.json();
    }).then(results => {
      if (results.success) {
        const userLevel = results.data.user_level;
        results = results.data.data; // results: array of data objects sorted new->old.
        // Clear all results.
        const resultsSection = document.querySelector('.results');

        const resultsMessage = document.querySelector('.results-message');
        if (resultsMessage) {
          resultsSection.removeChild(resultsMessage);
        }

        let resultItem = document.querySelector('.results .result-item');
        while (resultItem) {
          resultsSection.removeChild(resultItem);
          resultItem = document.querySelector('.results .result-item');
        }

        if (results.length === 0) {
          const noResults = document.createElement('p');
          noResults.classList.add('results-message');
          noResults.textContent = 'No results yet!';
          resultsSection.appendChild(noResults);
        }

        // Display each new result.
        for (const data of results) {
          const result = new Result(data);
          document.querySelector('.results').appendChild(result.display(userLevel));
        }
      } else {
        const resultsMessage = document.querySelector('.results-message');
        resultsMessage.textContent = 'Could not get results:', results.message;
      }
    }).catch(err => {
      console.log(err);
    });
  }

  static getOne(id, itemToReplace) {
    return fetch(`/api/results/${id}`, {
      credentials: 'include'
    }).then(res => {
      // Get JSON data from Response object.
      return res.json();
    }).then(data => {
      if (data.success) {
        let userLevel = data.data.user_level;
        let successData = data.data.data;

        // Display new result.
        const result = new Result(successData);
        console.log('user:', userLevel);
        itemToReplace.parentElement.insertBefore(result.display(userLevel), itemToReplace);
        itemToReplace.remove();
      } else {
        alert('Could not get result:', data.message);
      }
    }).catch(err => {
      console.log(err);
    });
  }

  static post(data) {
    return fetch('/api/results', {
      method: 'POST',
      credentials: 'include',
      headers: new Headers({'Content-Type': 'application/json'}),
      body: JSON.stringify(data)
    }).then(res => {
      // Get JSON data from Response object.
      return res.json();
    }).then(data => {
      if (data.success) {
        // Update news.
        return Result.get(data.data);
      } else {
        throw new Error(data.message);
      }
    });
  }

  static put(data) {
    return fetch('/api/results', {
      method: 'PUT',
      credentials: 'include',
      headers: new Headers({'Content-Type': 'application/json'}),
      body: JSON.stringify(data)
    }).then(res => {
      // Get JSON data from Response object.
      return res.json();
    }).then(data => {
      if (data.success) {
        // Update news.
        return Result.get(newSort);
      } else {
        throw new Error(data.message);
      }
    });
  }

  static clear(id, resultItem) {
    return fetch(`/api/results/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    }).then(res => {
      // Get JSON data from Response object.
      return res.json();
    }).then(data => {
      if (data.success) {
        // TODO: Implement properly.
        // resultItem.querySelector('')
        // resultItem.remove();
        Result.getOne(id, resultItem);
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
    case validity.badInput:
      message = `${name} is bad input.`;
      break;
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

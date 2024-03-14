// simple test with ReactDOM
// http://localhost:3000/counter

import * as React from 'react'
import {act} from 'react-dom/test-utils'
import Counter from '../../components/counter'
import {createRoot} from 'react-dom/client'

// NOTE: this is a new requirement in React 18
// https://react.dev/blog/2022/03/08/react-18-upgrade-guide#configuring-your-testing-environment
// Luckily, it's handled for you by React Testing Library :)

global.IS_REACT_ACT_ENVIRONMENT = true

beforeEach(() => {
  document.body.innerHTML = ''
})

test('counter increments and decrements when the buttons are clicked', () => {
  const div = document.createElement('div')
  document.body.append(div)

  // test case 1: render
  const root = createRoot(div)
  act(() => root.render(<Counter />))
  const message = div.firstChild.querySelector('div')
  expect(message.textContent).toBe('Current count: 0')

  // test case 2: button click
  const [decrement, increment] = div.querySelectorAll('button')
  act(() => decrement.click())
  expect(message.textContent).toBe('Current count: -1')
  act(() => increment.click())
  expect(message.textContent).toBe('Current count: 0')
})

test('extra credit #1: use dispatchEvent', () => {
  const div = document.createElement('div')
  document.body.append(div)

  // test case 1: render
  const root = createRoot(div)
  act(() => root.render(<Counter />))
  const message = div.firstChild.querySelector('div')

  // test case 2: button click
  const [decrement, increment] = div.querySelectorAll('button')
  const clickEvent = new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
    button: 0,
  })
  act(() => increment.dispatchEvent(clickEvent))
  expect(message.textContent).toBe('Current count: 1')
  act(() => decrement.dispatchEvent(clickEvent))
  expect(message.textContent).toBe('Current count: 0')
  act(() => decrement.dispatchEvent(clickEvent))
  expect(message.textContent).toBe('Current count: -1')
})

/* eslint no-unused-vars:0 */

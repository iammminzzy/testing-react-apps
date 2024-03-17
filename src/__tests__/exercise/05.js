// mocking HTTP requests
// http://localhost:3000/login-submission

import * as React from 'react'
import {render, screen, waitForElementToBeRemoved} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {build, fake} from '@jackfranklin/test-data-bot'
import {rest} from 'msw'
import {setupServer} from 'msw/node'

import Login from '../../components/login-submission'

const buildLoginForm = build({
  fields: {
    username: fake(f => f.internet.userName()),
    password: fake(f => f.internet.password()),
  },
})

// 1. set up the mock server
const server = setupServer(
  rest.post(
    'https://auth-provider.example.com/api/login',
    async (req, res, ctx) => {
      if (!req.body.username) {
        return res(ctx.status(400), ctx.json({message: 'username required!'}))
      }
      if (!req.body.password) {
        return res(ctx.status(400), ctx.json({message: 'password required!'}))
      }
      return res(ctx.status(200), ctx.json({username: req.body.username}))
    },
  ),
)

// 2.run ans stop the server
beforeAll(() => server.listen())
afterAll(() => server.close())

test(`logging in displays the user's username`, async () => {
  render(<Login />)
  const {username, password} = buildLoginForm()

  // 3. activate user events
  await userEvent.type(screen.getByLabelText(/username/i), username)
  await userEvent.type(screen.getByLabelText(/password/i), password)
  await userEvent.click(screen.getByRole('button', {name: /submit/i}))

  // 4. when you want to test scenarios where specific elements are expected to be removed from the DOM after certain actions or events
  await waitForElementToBeRemoved(() => screen.getByLabelText(/loading/i))

  // 5. expected scenario
  expect(screen.getByText(username)).toBeInTheDocument()
})

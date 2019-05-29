import { Session } from '../session'

it('can create new session', () => {
  expect(new Session({ apiKey: '', apiDomain: '', kmId: '' })).toMatchSnapshot()
})

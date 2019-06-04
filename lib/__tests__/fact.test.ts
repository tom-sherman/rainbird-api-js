import { Fact } from '../fact'

describe('fact', () => {
  test('should construct without cf', () => {
    expect(
      new Fact({ subject: 's', relationship: 'r', object: 'o' })
    ).toMatchSnapshot()
  })

  test('can set cf to below 100', () => {
    expect(
      new Fact({ subject: 's', relationship: 'r', object: 'o', cf: 80 })
    ).toMatchSnapshot()
  })

  test('should throw when setting cf out of bounds of 1-00', () => {
    ;[
      () => new Fact({ subject: 's', relationship: 'r', object: 'o', cf: 101 }),
      () => new Fact({ subject: 's', relationship: 'r', object: 'o', cf: 0 }),
      () => new Fact({ subject: 's', relationship: 'r', object: 'o', cf: -1 })
    ].forEach(errorFn => expect(errorFn).toThrow('cf must be between 1-100'))
  })

  test('should throw when setting cf to a non number', () => {})
})

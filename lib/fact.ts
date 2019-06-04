export type RainbirdObject = string | number | boolean

export class Fact {
  subject: string
  relationship: string
  object: RainbirdObject
  cf: number

  constructor({ subject, relationship, object, cf = 100 }: FactOptions) {
    if (cf > 100) {
      throw new Error('cf must be between 1-100')
    }

    this.subject = subject
    this.relationship = relationship
    this.object = object
    this.cf = cf
  }
}

interface FactOptions {
  subject: string
  relationship: string
  object: RainbirdObject
  cf?: number
}

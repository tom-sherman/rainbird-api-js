export type RainbirdObject = string | number | boolean

export class Fact {
  subject: string
  relationship: string
  object: RainbirdObject
  cf: number

  constructor({ subject, relationship, object, cf = 100 }: Fact) {
    this.subject = subject
    this.relationship = relationship
    this.object = object
    this.cf = cf
  }
}

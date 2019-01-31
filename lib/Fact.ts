import { RainbirdObject, Metadata } from './Interfaces';

export class Fact {
  readonly meta: Metadata;
  readonly object: RainbirdObject;
  readonly subject: string;
  readonly id: string;
  readonly relationship: string;
  readonly relationshipType: string;
  readonly certainty: number;

  constructor ({ certainty, factID, subject, relationshipType, relationship, objectMetadata, object }: FactData) {
    this.meta = objectMetadata;
    this.object = object;
    this.subject = subject;
    this.id = factID;
    this.relationship = relationship;
    this.relationshipType = relationshipType;
    this.certainty = certainty;
  }

  async audit () {

  }
}

export interface FactData {
  objectMetadata: Metadata;
  object: RainbirdObject;
  subject: string;
  factID: string;
  relationship: string;
  relationshipType: string;
  certainty: number;
}

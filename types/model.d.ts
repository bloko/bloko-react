export class Model {
  toJSON() : object;
  getRules() : object;
  getChildrenModelName() : string;
  validate(props: object) : never;
}

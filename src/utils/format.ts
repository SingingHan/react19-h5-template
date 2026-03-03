import { capitalize, kebabCase } from 'lodash-es';

export function toLabel(input: string) {
  return capitalize(kebabCase(input).replace(/-/g, ' '));
}

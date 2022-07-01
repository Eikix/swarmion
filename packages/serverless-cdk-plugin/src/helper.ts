import { Construct } from 'constructs';
import { O } from 'ts-toolbelt';

export const getCdkProperty = <T extends Construct>(
  prop: O.SelectKeys<T, string> & string,
): string => {
  return `$\{serverlessCdkBridgePlugin:${prop}}`;
};
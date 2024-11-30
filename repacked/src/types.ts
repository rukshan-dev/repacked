import { Options } from "tsup";

type Unpacked<T> = T extends undefined ? never : T extends (infer U)[] ? U : T;
export type TsupPlugin = Unpacked<Options["plugins"]>;

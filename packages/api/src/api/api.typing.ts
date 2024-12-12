export namespace API {
  export type Config = {
    nodes: Node[];
    agent?: Agent;
  };

  export type Node = {
    id: string;
    address: string;
    passive?: boolean;
  };

  export type Agent = {
    interval?: string | number;
    count?: number;
  };
}

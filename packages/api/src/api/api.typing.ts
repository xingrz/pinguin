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

  export type Ping = number | null;

  export type PingReport = {
    src: string;
    dst: string;
    ping: Ping;
  };

  export type PingMatrix = {
    [src: string]: {
      [dst: string]: {
        ping: Ping;
        updatedAt: string;
      };
    };
  };
}

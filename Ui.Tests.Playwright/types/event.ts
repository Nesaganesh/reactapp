class market {
    public outcomes: number[] = [];
    public marketId: number = 0;
  }
  
  export class eventData {
    public markets: market[] = [];
    public eventId: number = 0;
    constructor() {};
  }
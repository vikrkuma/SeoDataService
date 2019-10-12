export class Result<T, E> {
  constructor(private value: T | E) {}

  public isOk = (): boolean => {
    return this instanceof OK;
  };

  public unwrap = () => {
    return this instanceof OK ? (this.value as T) : (this.value as E);
  };
}

export class OK<T> extends Result<T, never> {
  constructor(ok: T) {
    super(ok);
  }
}

export class ERR<E> extends Result<never, E> {
  constructor(error: E) {
    super(error);
  }
}

export type PR<T, E> = Promise<Result<T, E>>;

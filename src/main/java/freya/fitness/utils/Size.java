package freya.fitness.utils;

import java.util.Optional;

public enum Size {

  ORIGINAL(0),
  MINI(48),
  XS(600),
  SM(960),
  MD(1280),
  LG(1920),
  XL(2569);

  int preferredSize; // next breakpoint according to https://material-ui.com/layout/breakpoints/

  Size(int preferredSize) {
    this.preferredSize = preferredSize;
  }

  public int getPreferredSize() {
    return preferredSize;
  }

  Optional<Size> nextBigger() {
    int ordinal = this.ordinal();
    final Size[] values = Size.values();
    return values.length > ordinal + 1
        ? Optional.of(values[ordinal + 1])
        : Optional.empty();
  }

}

 // 1. Obtener la codificación Hexadecimal del color predominante
  // Método de clase mirando la propiedad 'predonimantColor'
  // getPredominentHexColor()

  // 2. Comprar dos imagenes y averiguar cuál tiene más azul en su color predominante
  // static greatestBlue(imageA, imageB)
  // greatestBlue(anotherImage)

  // 3. Obtener el titulo de la imagen en maysuculas
  // getTitleUpperCase()



class UtilsMath {
    static tripple(n) {
      n = n || 1;
      return n * 3;
    }

    static double(n) {
        n = n || 1;
        return n * 2;
      }
  }


class MyNumber {
    constructor(initValue) {
        this.value = initValue
    }

    double() {
        return this.value * 2
    }
}

console.log(UtilsMath.double(3))
console.log(new MyNumber(2).double())
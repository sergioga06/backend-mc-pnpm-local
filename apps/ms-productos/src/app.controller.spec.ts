import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// 1. EL GRUPO DE PRUEBAS (describe)
// Define un "bloque" o familia de pruebas para el 'AppController'.
// Todo lo que esté aquí dentro serán test específicos para ese controlador.
describe('AppController', () => {
  let appController: AppController;

  // 2. PREPARACIÓN (beforeEach)
  // Esta función se ejecuta AUTOMÁTICAMENTE antes de CADA prueba individual.
  // Sirve para empezar siempre con un entorno limpio y fresco.
  beforeEach(async () => {
    // Creamos un "módulo de pruebas" (una mini-aplicación NestJS falsa).
    // Es como montar un escenario de teatro solo para probar a este actor.
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController], // El actor principal que vamos a probar.
      providers: [AppService],      // Los ayudantes que necesita el actor.
    }).compile(); // .compile() construye el escenario.

    // Recuperamos la instancia del controlador que acabamos de crear en el escenario.
    // Ahora 'appController' es el objeto real con el que vamos a interactuar.
    appController = app.get<AppController>(AppController);
  });

  // 3. SUB-GRUPO DE PRUEBAS
  // Podemos agrupar pruebas más específicas. Aquí probamos la funcionalidad "root" (raíz).
  describe('root', () => {
    
    // 4. LA PRUEBA EN SÍ (it)
    // 'it' define una prueba concreta. El texto explica qué DEBERÍA pasar.
    it('should return "Hello World!"', () => {
      
      // 5. LA EXPECTATIVA (expect)
      // Aquí es donde comprobamos si la prueba pasa o falla.
      // Traducido: "Espero que si llamo a appController.getHello(), el resultado sea exactamente 'Hello World!'".
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
# Indicador para el autor del hilo
Esta es una función que muestra un indicador en los hilos al lado del nombre de
usuario del autor, para ayudar a los EPs saber si el autor ha participado en
otros hilos, lo que ayuda a encontrar hilos duplicados o obtener más contexto
sobre el problema del usuario al poder visitar los otros hilos donde ha
publicado o respondido.

Hay dos opciones, que usan métodos e indicadores diferentes para ayudarte a
determinar si el autor del hilo ha participado en otros hilos:

1. La primera opción busca en el Foro actual los 5 hilos más recientes donde el
autor del hilo ha participado. Después, dependiendo de la lista de hilos
devuelta, se muestra un punto al lado de su nombre de usuario que muestra uno
de los estados siguientes:
    * Punto azul: si la búsqueda solo devolvió el hilo actual.
    * Punto naranja: si la búsqueda devolvió más hilos, pero los otros hilos se
    han marcado como leídos.
    * Punto rojo: si la búsqueda devolvió más hilos, pero al menos uno de ellos
    no está marcado como leído.
2. La segunda opción hace una petición para cargar el perfil del usuario en vez
de buscar en el foro los hilos en sí. Esto devuelve el número de publicaciones
(incluyendo los nuevos hilos, respuestas normales y respuestas recomendadas)
hechas por el usuario durante el último año, agregadas por mes. La extensión
suma los valores para los `n` meses más recientes (`n` es un valor
configurable) y muestra el número resultante al lado del nombre de usuario del
autor del hilo.

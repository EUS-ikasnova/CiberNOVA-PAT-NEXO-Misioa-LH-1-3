# Publicar CiberNOVA-PAT gratis (GitHub Pages)

Esta versión funciona como web estática: no necesita Cloud Run, facturación de Google ni clave de Gemini.

1. Crea una cuenta gratuita en https://github.com si no tienes una.
2. Crea un repositorio **público** llamado `cibernova-pat` (sin README inicial).
3. Sube **el contenido de esta carpeta** al repositorio, incluidos `.github/workflows/deploy.yml`, `src`, `public`, `package.json`, etc. No subas el ZIP sin extraer.
4. En el repositorio entra en **Settings > Pages > Build and deployment > Source** y selecciona **GitHub Actions**.
5. Abre **Actions** y espera a que termine el flujo «Publicar CiberNOVA-PAT en GitHub Pages». Si no se ejecuta, selecciona «Run workflow».
6. Tu dirección será similar a `https://TU-USUARIO.github.io/cibernova-pat/`.
7. Pruébala desde otro dispositivo sin iniciar sesión.

**Avisos:** el código será público; revisa si contiene información privada antes de subirlo. La voz depende de las voces instaladas en el navegador y puede no haber una voz natural en euskera. La grabación de voz necesita HTTPS y permiso de micrófono. Los datos almacenados localmente no se comparten entre dispositivos. GitHub Pages tiene límites y condiciones de uso, y la publicación estática no incluye servicios de IA en servidor.

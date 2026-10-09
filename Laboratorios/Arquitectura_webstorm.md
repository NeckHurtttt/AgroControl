//1.-La arquitectura del Webstorm-AgroControl//
index.html ->main.tsx (StrictMode + ErrorBoundary + BrowserRouter)
                 \
                  
          routes/AppRouter.tsx  (<Routes>, ruta padre = MainLayout)
                 \
          layouts/MainLayout.tsx  (Header + Sidebar + <Outlet />)
                 \
          pages  -> features/<entidad>/pages/PrediosPage.tsx
                 \  props ->           callbacks (onEdit, onSubmit…)
          components ->features/<entidad>/components (Form, Table)
                     + components/ui (Button, Modal, Pagination…)
                 \
          hooks -> features/predios/hooks/usePredios.ts
                 \
          services -> features/predios/services/prediosService.ts
                 \
          api/apiClient.ts (apiFetch + ApiError)  -> config/env.ts (API_URL)
                 \
          Backend Spring Boot

//Capas
 /Responsabilidades
 Router:  Decide qué página mostrar según la URL
Layout: Estructura persistente (Header, Sidebar, Outlet)
 Pages: Componen la pantalla y decicion de efectos.
 Components: Pintan y emiten intenciones por callbacks
 Hooks: Estado y asincronía (loading, error, data)
 Services: Operaciones del recurso (GET, POST, PUT, DELETE)
 AppiClient: Mecanica HTTP común: headers, response.ok, ApiError
 Config: Lee VITE_API_URL y falla al arrancar si falta 

 /Fisica vs Estructura
La implementacion fisica es por feature  cada entidad (predios, parcelas…) tiene su propia carpeta con 
components/hooks/services/models. La arquitectura es la regla de dependencias: 
**una capa solo habla con la que tiene debajo*. Los componentes UI no importan services, y los services no tocan el DOM. 
Tener la carpeta services/ no basta. 
Lo que importa es que nadie se salte las capas.
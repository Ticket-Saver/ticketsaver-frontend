/**
 * Función proxy para evitar problemas de CORS con la API externa
 * Redirige todas las peticiones a la API de ticketsaver
 */

const API_BASE_URL = 'https://ticketsaverapi.strangled.net';

exports.handler = async (event, context) => {
  // Extraer la ruta y parámetros de la petición
  const path = event.path.replace('/.netlify/functions/proxy-api', '');
  const queryString = event.rawQuery ? `?${event.rawQuery}` : '';
  const url = `${API_BASE_URL}${path}${queryString}`;

  console.log('Proxy request:', {
    method: event.httpMethod,
    path,
    url,
    headers: event.headers
  });

  try {
    // Preparar headers para la petición
    const headers = {
      'Content-Type': 'application/json',
    };

    // Si hay token de autenticación, pasarlo
    if (event.headers.authorization) {
      headers['Authorization'] = event.headers.authorization;
    }

    // Preparar opciones para fetch
    const fetchOptions = {
      method: event.httpMethod,
      headers: headers,
    };

    // Si hay body en la petición, agregarlo
    if (event.body && event.httpMethod !== 'GET') {
      fetchOptions.body = event.body;
    }

    // Hacer la petición a la API externa
    const response = await fetch(url, fetchOptions);
    const data = await response.text();

    // Intentar parsear como JSON
    let responseBody;
    try {
      responseBody = JSON.parse(data);
    } catch (e) {
      responseBody = data;
    }

    console.log('Proxy response:', {
      status: response.status,
      ok: response.ok
    });

    // Devolver la respuesta con headers CORS apropiados
    return {
      statusCode: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Content-Type': 'application/json',
      },
      body: typeof responseBody === 'string' ? responseBody : JSON.stringify(responseBody),
    };
  } catch (error) {
    console.error('Proxy error:', error);

    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: 'Error al conectar con la API',
        message: error.message,
      }),
    };
  }
};


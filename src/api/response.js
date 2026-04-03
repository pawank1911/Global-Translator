export const parseApiResponse = async (response) => {
  const rawBody = await response.text();
  const contentType = response.headers.get('content-type') || '';
  const hasJsonBody = contentType.includes('application/json');

  if (!rawBody.trim()) {
    return {
      data: null,
      rawBody: '',
      contentType
    };
  }

  if (hasJsonBody) {
    try {
      return {
        data: JSON.parse(rawBody),
        rawBody,
        contentType
      };
    } catch {
      throw new Error('The API returned invalid JSON.');
    }
  }

  return {
    data: null,
    rawBody,
    contentType
  };
};

export const getApiErrorMessage = ({ response, data, rawBody, fallbackMessage }) => {
  if (data && typeof data === 'object') {
    return (
      data.message ||
      data.error ||
      data.Error ||
      data.details ||
      fallbackMessage
    );
  }

  if (rawBody.trim()) {
    return `${fallbackMessage} (${response.status} ${response.statusText})`;
  }

  return `${fallbackMessage} (${response.status} ${response.statusText || 'empty response'})`;
};

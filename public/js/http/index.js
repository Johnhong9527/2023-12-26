const timeout = 15000
const axiosConfig = {
  timeout,
  withCredentials: false,
  headers: {
    'X-Requested-With': 'XMLHttpRequest'
  }
}

function objectToQueryString(obj) {
  const parts = [];
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      if (value !== null && value !== undefined) {
        parts.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
      }
    }
  }
  return parts.join('&');
}

const isQuery = ({method, url, option, isPost}) => {
  if (method === 'DELETE' && /\/api\/v1\/create\/song\/\d+/.test(url)) {
    return false
  }
  if(['GET', 'DELETE', 'HEAD'].indexOf(method) > -1) {
    return true
  }
  return false
}

const isBody = ({method, url, option, isPost}) => {
  if (method === 'DELETE' && /\/api\/v1\/create\/song\/\d+/.test(url)) {
    return true
  }
  return isPost
}

const request = (method, url, option = {}) => {
  let isPost = true
  const config = option.config || {}
  delete option.config

  method = (method || '').toUpperCase()

  console.log('url', method, url);
  if (isQuery({method, url, option})) {
    const query = objectToQueryString({
      ...option,
      addQueryPrefix: true
    })
    isPost = false

    if (url.indexOf('?') > -1) {
      url += query.replace('?', '&')
    } else {
      url += '?' + query
    }
  }

  const makeConfig = { method, url }
  if (isBody({method, url, option, isPost})) {
    makeConfig.data = option
  }

  return axios({
    ...axiosConfig,
    ...makeConfig,
    ...config
  }).then(ret => ret.data)
}
const $http = {
  // 插入数据
  registe: (params) => request('post', '/api/v1/insert', params),
  registe: (params) => request('get', '/api/v1/list', params),
  registe: (params) => request('get', '/api/v1/list', params),
};

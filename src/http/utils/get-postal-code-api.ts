interface IAddress {
  rua: string | null
  bairro: string | null
  cidade: string | null
  estado: string | null
}

interface IPostalCodeAPI {
  cep?: string | null
  logradouro?: string | null
  complemento?: string | null
  bairro?: string | null
  localidade?: string | null
  uf?: string | null

  ddd?: string | null
  gia?: string | null
  ibge?: string | null
  siafi?: string | null
}

export async function getPostalCodeAPI(zipCode: string): Promise<IAddress> {
  const response = await fetch(`https://viacep.com.br/ws/${zipCode}/json/`)

  if (!response.ok) {
    throw new Error('...')
  }

  const data: IPostalCodeAPI = await response.json()

  const address: IAddress = {
    rua: data?.logradouro || null,
    bairro: data?.bairro || null,
    cidade: data?.localidade || null,
    estado: data?.uf || null,
  }

  return address
}

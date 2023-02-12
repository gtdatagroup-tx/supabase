import { NextApiRequest, NextApiResponse } from 'next'

import apiWrapper from 'lib/api/apiWrapper'

import type { Organization } from 'types'

export default (req: NextApiRequest, res: NextApiResponse) => apiWrapper(req, res, handler)

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req

  switch (method) {
    case 'GET':
      return handleGetAll(req, res)
    default:
      res.setHeader('Allow', ['GET'])
      res.status(405).json({ data: null, error: { message: `Method ${method} Not Allowed` } })
  }
}

const handleGetAll = async (req: NextApiRequest, res: NextApiResponse) => {
  // Platform specific endpoint
  const response: Organization[] = [
    {
      id: 1,
      name: process.env.DEFAULT_ORGANIZATION_NAME || 'Default Organization',
      slug: 'default-org-slug',
      billing_email: 'billing@supabase.co',
    },
  ]
  return res.status(200).json(response)
}

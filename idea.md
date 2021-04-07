## The process for DID verification:

(relatively simple/straightforward)

- User requests PoPP to popp.gitcoin.com/verify
	- includes did, gitcoinId (?)
	- api checks gitcoin.co endpoint for verification
		- returns attestation of points


## Important things to track later

- Twitter account suspension
- BrightId revoked



### 
{
	did,
	username,
	userId,
	type: 'TrustBonus' // Should this be the "type" or "Popp"?
}

{
  sub: did,
  nbf: Math.floor(Date.now() / 1000),
  vc: {
    '@context': ['https://www.w3.org/2018/credentials/v1'],
    type: ['VerifiableCredential'],
    credentialSubject: {
      account: {
        type: type,
        username, // gitcoin username 
        ...(verification_url && { url: verification_url }),
        ...(userId && { id: userId })
      }
    }
  }
},
{
  issuer: `did:web:${this.issuerDomain}`,
  signer
}



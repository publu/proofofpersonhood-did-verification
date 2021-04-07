class TrustbonusVerifyHandler {
  constructor(claimMgr, analytics) {
    this.name = 'DiscordVerifyHandler'
    this.claimMgr = claimMgr
    this.analytics = analytics
  }

  async handle(event, context, cb) {
    let body
    try {
      body = JSON.parse(event.body)
    } catch (e) {
      cb({ code: 400, message: 'no json body: ' + e.toString() })
      return
    }

    if (!body.jws) {
      cb({ code: 403, message: 'no jws' })
      this.analytics.trackVerifyDiscord(body.jws, 403)
      return
    }

    let did = ''
    let challengeCode = ''

    try {
      const unwrappped = await this.claimMgr.verifyJWS(body.jws)
      challengeCode = unwrappped.payload.challengeCode
      did = unwrappped.did
    } catch (e) {
      cb({ code: 500, message: 'error while trying to verify the JWS' })
      this.analytics.trackVerifyDiscord(body.jws, 500)
      return
    }
    let userId
    let username = ''
    try {
      const directMessageDetails = await this.discordMgr.confirmRequest(
        did,
        challengeCode
      )
      userId = directMessageDetails.userId
      username = directMessageDetails.username
    } catch (e) {
      cb({
        code: 500,
        message: 'error while trying verify discord. ' + e
      })
      this.analytics.trackVerifyDiscord(did, 500)
      return
    }

    let attestation = ''
    try {
      attestation = await this.claimMgr.issue({
        did,
        username,
        userId,
        type: 'Discord'
      })
    } catch (e) {
      cb({ code: 500, message: 'could not issue a verification claim' + e })
      this.analytics.trackVerifyDiscord(did, 500)
      return
    }

    cb(null, { attestation })
    this.analytics.trackVerifyDiscord(did, 200)
  }
}
module.exports = DiscordVerifyHandler

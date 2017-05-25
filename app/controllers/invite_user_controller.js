const logger = require('winston');
let response = require('../utils/response.js');
let userService = require('../services/user_service.js');
let paths = require('../paths.js');
let successResponse = response.response;
let errorResponse = response.renderErrorView;
let rolesModule = require('../utils/roles');
let emailTools = require('../utils/email_tools')();

module.exports = {

  /**
   * Show 'Invite a team member' page
   * @param req
   * @param res
   */

  index: (req, res) => {
    let roles = rolesModule.roles;

    let data = {
      admin: {id: roles['admin'].extId},
      viewAndRefund: {id: roles['view-and-refund'].extId},
      view: {id: roles['view-only'].extId}
    };

    return successResponse(req, res, 'services/team_member_invite', data);
  },

  /**
   * Save invite
   * @param req
   * @param res
   */
  invite: (req, res) => {
    let correlationId = req.correlationId;
    let senderId = req.user.externalId;
    let invitee = req.body['invitee-email'];
    let serviceId = req.user.serviceIds[0];
    let roleId = req.body['role-input'];

    let role = rolesModule.getRoleByExtId(roleId);

    let onSuccess = () => {
      req.flash('generic', `Invite sent to ${invitee}`);
      res.redirect(303, paths.teamMembers.index);
    };

    if (!emailTools.validateEmail(invitee)) {
      req.flash('genericError', `Invalid email address`);
      res.redirect(303, paths.teamMembers.invite);
      return;
    }

    if (!role) {
      logger.error(`[requestId=${correlationId}] cannot identify role from user input ${roleId}`);
      errorResponse(req, res, 'Unable to create invitation', 200);
      return;
    }

    return userService.inviteUser(invitee, senderId, serviceId, role.name, correlationId)
      .then(onSuccess)
      .catch((err) => {
        logger.error(`[requestId=${correlationId}]  Unable to send invitation to user - ` + JSON.stringify(err.message));
        errorResponse(req, res, 'Unable to create invitation', 200);
      });
  }

};
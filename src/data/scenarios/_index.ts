import type { Scenario, ScenarioMeta } from '@/types/scenario';
import { meta as basicMeta } from './basic-room-creation.meta';
import { meta as hanaInsuranceMeta } from './hana-insurance-collab.meta';
import { meta as wooriMeta } from './woori-credit.meta';
import { meta as aiMeta } from './ai-smart-assist.meta';
import { meta as nextGenMeta } from './next-gen-comm.meta';
import { meta as gaonMeta } from './gaon-cable-sales-bridge.meta';
import { meta as gaonKakaoChannelInviteMeta } from './gaon-feature-kakao-channel-invite.meta';
import { meta as gaonMultiFileMessageMeta } from './gaon-feature-multi-file-message.meta';
import { meta as gaonTalkSearchByMaterialMeta } from './gaon-feature-talk-search-by-material.meta';
import { meta as gaonFileLibraryReuseMeta } from './gaon-feature-file-library-reuse.meta';
import { meta as gaonFlowQuoteCycleMeta } from './gaon-flow-quote-cycle.meta';
import { meta as skRentalMeta } from './sk-rental-sales-bridge.meta';
import { meta as skAlimtalkInviteMeta } from './sk-feature-alimtalk-invite.meta';
import { meta as skFcmPushInboundMeta } from './sk-feature-fcm-push-inbound.meta';
import { meta as skMultiImageMeta } from './sk-feature-multi-image.meta';
import { meta as skDbMartExportMeta } from './sk-feature-db-mart-export.meta';
import { meta as skMyPartnersMeta } from './sk-feature-my-partners.meta';
import { meta as skAdminPartnerTransferMeta } from './sk-feature-admin-partner-transfer.meta';
import { meta as skContactSyncMeta } from './sk-feature-contact-sync.meta';
import { meta as skBiometricLoginMeta } from './sk-feature-biometric-login.meta';
import { meta as skPc2faPushMeta } from './sk-feature-pc-2fa-push.meta';
import { meta as skPartnerMetadataBadgeMeta } from './sk-feature-partner-metadata-badge.meta';
import { meta as skPasswordToggleMeta } from './sk-feature-password-toggle.meta';
import { meta as skFlowNewCustomerLifecycleMeta } from './sk-flow-new-customer-lifecycle.meta';
import { meta as skFlowWorkdayMeta } from './sk-flow-workday.meta';
import { meta as skFlowHandoverVsLeaveMeta } from './sk-flow-handover-vs-leave.meta';
import { meta as hanaOcrSingleMeta } from './hana-feature-ocr-single.meta';
import { meta as hanaMultiSelectMeta } from './hana-feature-multi-select-ocr.meta';
import { meta as hanaTaskChipMeta } from './hana-feature-task-chip.meta';
import { meta as hanaCustomerSfaMeta } from './hana-feature-customer-sfa.meta';
import { meta as hanaConsentBizformMeta } from './hana-feature-consent-bizform.meta';
import { meta as hanaLongDesignPdfMeta } from './hana-feature-long-design-pdf.meta';
import { meta as hanaFlowMessageToTaskMeta } from './hana-flow-message-to-task.meta';
import { meta as hanaFlowConsentToDesignMeta } from './hana-flow-consent-to-design.meta';
import { meta as wooriTaskFromInquiryMeta } from './woori-feature-task-from-inquiry.meta';
import { meta as wooriSecretMessageMeta } from './woori-feature-secret-message.meta';
import { meta as wooriViewerSwitchMeta } from './woori-feature-viewer-switch.meta';
import { meta as wooriBizformMobileMeta } from './woori-feature-bizform-mobile.meta';
import { meta as wooriBizformApprovalMeta } from './woori-feature-bizform-approval.meta';
import { meta as wooriFlowSecretCoordMeta } from './woori-flow-secret-coordination.meta';
import { meta as wooriFlowBizformCycleMeta } from './woori-flow-bizform-cycle.meta';

interface ScenarioRegistryEntry extends ScenarioMeta {
  load: () => Promise<Scenario>;
}

const lazy =
  (importer: () => Promise<{ default: Scenario }>) =>
  (): Promise<Scenario> =>
    importer().then((m) => m.default);

export const scenarioRegistry: ScenarioRegistryEntry[] = [
  { ...basicMeta, load: lazy(() => import('./basic-room-creation')) },
  { ...hanaInsuranceMeta, load: lazy(() => import('./hana-insurance-collab')) },
  {
    ...hanaOcrSingleMeta,
    load: lazy(() => import('./hana-feature-ocr-single')),
  },
  {
    ...hanaMultiSelectMeta,
    load: lazy(() => import('./hana-feature-multi-select-ocr')),
  },
  {
    ...hanaTaskChipMeta,
    load: lazy(() => import('./hana-feature-task-chip')),
  },
  {
    ...hanaCustomerSfaMeta,
    load: lazy(() => import('./hana-feature-customer-sfa')),
  },
  {
    ...hanaConsentBizformMeta,
    load: lazy(() => import('./hana-feature-consent-bizform')),
  },
  {
    ...hanaLongDesignPdfMeta,
    load: lazy(() => import('./hana-feature-long-design-pdf')),
  },
  {
    ...hanaFlowMessageToTaskMeta,
    load: lazy(() => import('./hana-flow-message-to-task')),
  },
  {
    ...hanaFlowConsentToDesignMeta,
    load: lazy(() => import('./hana-flow-consent-to-design')),
  },
  { ...wooriMeta, load: lazy(() => import('./woori-credit')) },
  {
    ...wooriTaskFromInquiryMeta,
    load: lazy(() => import('./woori-feature-task-from-inquiry')),
  },
  {
    ...wooriSecretMessageMeta,
    load: lazy(() => import('./woori-feature-secret-message')),
  },
  {
    ...wooriViewerSwitchMeta,
    load: lazy(() => import('./woori-feature-viewer-switch')),
  },
  {
    ...wooriBizformMobileMeta,
    load: lazy(() => import('./woori-feature-bizform-mobile')),
  },
  {
    ...wooriBizformApprovalMeta,
    load: lazy(() => import('./woori-feature-bizform-approval')),
  },
  {
    ...wooriFlowSecretCoordMeta,
    load: lazy(() => import('./woori-flow-secret-coordination')),
  },
  {
    ...wooriFlowBizformCycleMeta,
    load: lazy(() => import('./woori-flow-bizform-cycle')),
  },
  { ...gaonMeta, load: lazy(() => import('./gaon-cable-sales-bridge')) },
  {
    ...gaonKakaoChannelInviteMeta,
    load: lazy(() => import('./gaon-feature-kakao-channel-invite')),
  },
  {
    ...gaonMultiFileMessageMeta,
    load: lazy(() => import('./gaon-feature-multi-file-message')),
  },
  {
    ...gaonTalkSearchByMaterialMeta,
    load: lazy(() => import('./gaon-feature-talk-search-by-material')),
  },
  {
    ...gaonFileLibraryReuseMeta,
    load: lazy(() => import('./gaon-feature-file-library-reuse')),
  },
  {
    ...gaonFlowQuoteCycleMeta,
    load: lazy(() => import('./gaon-flow-quote-cycle')),
  },
  {
    ...skRentalMeta,
    load: lazy(() => import('./sk-rental-sales-bridge')),
  },
  {
    ...skAlimtalkInviteMeta,
    load: lazy(() => import('./sk-feature-alimtalk-invite')),
  },
  {
    ...skFcmPushInboundMeta,
    load: lazy(() => import('./sk-feature-fcm-push-inbound')),
  },
  {
    ...skMultiImageMeta,
    load: lazy(() => import('./sk-feature-multi-image')),
  },
  {
    ...skContactSyncMeta,
    load: lazy(() => import('./sk-feature-contact-sync')),
  },
  {
    ...skBiometricLoginMeta,
    load: lazy(() => import('./sk-feature-biometric-login')),
  },
  {
    ...skPc2faPushMeta,
    load: lazy(() => import('./sk-feature-pc-2fa-push')),
  },
  {
    ...skMyPartnersMeta,
    load: lazy(() => import('./sk-feature-my-partners')),
  },
  {
    ...skPartnerMetadataBadgeMeta,
    load: lazy(() => import('./sk-feature-partner-metadata-badge')),
  },
  {
    ...skAdminPartnerTransferMeta,
    load: lazy(() => import('./sk-feature-admin-partner-transfer')),
  },
  {
    ...skPasswordToggleMeta,
    load: lazy(() => import('./sk-feature-password-toggle')),
  },
  {
    ...skDbMartExportMeta,
    load: lazy(() => import('./sk-feature-db-mart-export')),
  },
  {
    ...skFlowNewCustomerLifecycleMeta,
    load: lazy(() => import('./sk-flow-new-customer-lifecycle')),
  },
  {
    ...skFlowWorkdayMeta,
    load: lazy(() => import('./sk-flow-workday')),
  },
  {
    ...skFlowHandoverVsLeaveMeta,
    load: lazy(() => import('./sk-flow-handover-vs-leave')),
  },
  { ...aiMeta, load: lazy(() => import('./ai-smart-assist')) },
  { ...nextGenMeta, load: lazy(() => import('./next-gen-comm')) },
];

import { z } from 'zod';

export const RoleSchema = z.enum([
  'admin',
  'internal',
  'partner',
  'customer',
  'system',
  'me',
]);

export const DeviceKindSchema = z.enum(['pc', 'mobile', 'web', 'all']);

export const TalkTypeSchema = z.enum([
  'message',
  'system',
  'task_link',
  'bizform',
  'knowledge_link',
  'file_transfer',
  'approval_request',
  'approval_result',
  'invite',
  'notification',
]);

export const TalkActorSchema = z.object({
  role: RoleSchema,
  userId: z.string().optional(),
  displayName: z.string().optional(),
  avatarUrl: z.string().optional(),
});

export const TalkRecipientSchema = z.union([
  z.object({
    role: RoleSchema,
    userId: z.string().optional(),
  }),
  z.object({ broadcast: z.literal(true) }),
]);

export const TalkAttachmentSchema = z.object({
  name: z.string(),
  size: z.number().optional(),
  mime: z.string().optional(),
  url: z.string().optional(),
});

export const TalkActionSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('UPDATE_STATUS'),
    target: z.string(),
    value: z.string(),
  }),
  z.object({
    type: z.literal('CREATE_TASK'),
    payload: z.object({
      title: z.string(),
      assignee: z.string().optional(),
      dueDate: z.string().optional(),
    }),
  }),
  z.object({
    type: z.literal('ATTACH_BIZFORM'),
    formId: z.string(),
    data: z.record(z.string(), z.unknown()),
  }),
  z.object({
    type: z.literal('ATTACH_KNOWLEDGE'),
    knowledgeId: z.string(),
  }),
  z.object({
    type: z.literal('ATTACH_FILE'),
    fileId: z.string(),
  }),
  z.object({
    type: z.literal('INVITE_EXTERNAL'),
    email: z.string().optional(),
    link: z.string(),
  }),
  z.object({
    type: z.literal('JOIN_ROOM'),
    userId: z.string(),
    displayName: z.string(),
  }),
  z.object({
    type: z.literal('NOTIFY'),
    channel: z.string(),
    message: z.string(),
  }),
  z.object({
    type: z.literal('NAVIGATE'),
    device: DeviceKindSchema,
    route: z.string(),
  }),
]);

export const TalkSchema = z.object({
  id: z.string(),
  stepId: z.string(),
  type: TalkTypeSchema,
  from: TalkActorSchema,
  to: TalkRecipientSchema,
  device: DeviceKindSchema,
  content: z.string(),
  attachments: z.array(TalkAttachmentSchema).optional(),
  mentions: z.array(z.string()).optional(),
  offsetMs: z.number().nonnegative(),
  action: TalkActionSchema.optional(),
  uiHint: z
    .object({
      highlight: z.array(z.string()).optional(),
    })
    .optional(),
  bubbleTone: z.enum(['default', 'navy']).optional(),
  secret: z
    .object({
      recipientParticipantId: z.string(),
    })
    .optional(),
  taskChip: z
    .object({
      taskId: z.string(),
      title: z.string(),
      status: z.enum(['처리중', '완료']),
    })
    .optional(),
  bizformRef: z
    .object({
      bizformId: z.string(),
    })
    .optional(),
});

export const DeviceTargetSchema = z.enum(['pc', 'mobile', 'all']);

const TaskStatusSchema = z.enum(['대기', '진행중', '검토중', '완료']);
const TaskChipStatusSchema = z.enum(['처리중', '완료']);
const BizFormFieldSeedSchema = z.object({
  id: z.string(),
  label: z.string(),
  value: z.string().optional(),
  file: z.boolean().optional(),
});
const MobileMenuIdSchema = z.enum([
  'notice',
  'knowledge',
  'board',
  'bizform',
  'participants',
  'guide',
]);

export const UIActionSchema = z.discriminatedUnion('kind', [
  z.object({
    kind: z.literal('open_modal'),
    modalId: z.string(),
    description: z.string(),
    initialStep: z.number().int().optional(),
    initialTab: z.string().optional(),
  }),
  z.object({
    kind: z.literal('close_modal'),
    modalId: z.string(),
    description: z.string(),
  }),
  z.object({
    kind: z.literal('set_modal_step'),
    modalId: z.string(),
    step: z.number().int(),
    description: z.string(),
  }),
  z.object({
    kind: z.literal('set_tab'),
    modalId: z.string(),
    tab: z.string(),
    description: z.string(),
  }),
  z.object({
    kind: z.literal('fill_input'),
    field: z.string(),
    value: z.string(),
    description: z.string(),
  }),
  z.object({
    kind: z.literal('toggle_check'),
    itemId: z.string(),
    on: z.boolean(),
    description: z.string(),
  }),
  z.object({
    kind: z.literal('click_button'),
    buttonId: z.string(),
    description: z.string(),
  }),
  z.object({
    kind: z.literal('show_toast'),
    message: z.string(),
    tone: z.enum(['success', 'info', 'warning']).optional(),
    description: z.string(),
  }),
  z.object({
    kind: z.literal('add_room'),
    roomId: z.string(),
    title: z.string(),
    participantCount: z.number().int().nonnegative(),
    preview: z.string(),
    description: z.string(),
  }),
  z.object({
    kind: z.literal('select_room'),
    roomId: z.string(),
    description: z.string(),
  }),
  z.object({
    kind: z.literal('append_system_message'),
    roomId: z.string(),
    content: z.string(),
    description: z.string(),
  }),
  z.object({
    kind: z.literal('append_chat'),
    roomId: z.string(),
    messageId: z.string().optional(),
    from: TalkActorSchema,
    content: z.string(),
    deviceTarget: DeviceTargetSchema.optional(),
    description: z.string(),
  }),
  z.object({
    kind: z.literal('add_participant'),
    roomId: z.string(),
    participantId: z.string(),
    displayName: z.string(),
    external: z.boolean(),
    device: z.enum(['PC', 'Mobile', 'Web']).optional(),
    isHost: z.boolean().optional(),
    description: z.string(),
  }),
  z.object({
    kind: z.literal('mobile_push_notice'),
    noticeId: z.string(),
    title: z.string(),
    body: z.string(),
    ctaLabel: z.string(),
    description: z.string(),
  }),
  z.object({
    kind: z.literal('mobile_open_room'),
    roomId: z.string(),
    noticeId: z.string().optional(),
    description: z.string(),
  }),
  z.object({
    kind: z.literal('add_task'),
    roomId: z.string(),
    taskId: z.string(),
    title: z.string(),
    assignee: z.string().optional(),
    dueDate: z.string().optional(),
    status: TaskStatusSchema.optional(),
    sourceMessageId: z.string().optional(),
    description: z.string(),
  }),
  z.object({
    kind: z.literal('update_task_status'),
    taskId: z.string(),
    status: TaskStatusSchema,
    description: z.string(),
  }),
  z.object({
    kind: z.literal('attach_bizform'),
    roomId: z.string(),
    bizformId: z.string(),
    title: z.string(),
    templateId: z.string().optional(),
    fields: z.array(BizFormFieldSeedSchema),
    messageId: z.string().optional(),
    description: z.string(),
  }),
  z.object({
    kind: z.literal('approve_bizform'),
    bizformId: z.string(),
    description: z.string(),
  }),
  z.object({
    kind: z.literal('reject_bizform'),
    bizformId: z.string(),
    reason: z.string().optional(),
    description: z.string(),
  }),
  z.object({
    kind: z.literal('attach_knowledge'),
    roomId: z.string(),
    knowledgeId: z.string(),
    title: z.string(),
    excerpt: z.string().optional(),
    source: z.string().optional(),
    description: z.string(),
  }),
  z.object({
    kind: z.literal('attach_file'),
    roomId: z.string(),
    fileId: z.string(),
    name: z.string(),
    size: z.number().optional(),
    mime: z.string().optional(),
    description: z.string(),
  }),
  z.object({
    kind: z.literal('send_secret_message'),
    roomId: z.string(),
    messageId: z.string(),
    from: TalkActorSchema,
    recipientParticipantId: z.string(),
    content: z.string(),
    deviceTarget: DeviceTargetSchema.optional(),
    description: z.string(),
  }),
  z.object({
    kind: z.literal('attach_task_chip'),
    roomId: z.string(),
    messageId: z.string(),
    taskId: z.string(),
    title: z.string(),
    description: z.string(),
  }),
  z.object({
    kind: z.literal('update_task_chip_status'),
    roomId: z.string(),
    messageId: z.string(),
    taskId: z.string(),
    status: TaskChipStatusSchema,
    description: z.string(),
  }),
  z.object({
    kind: z.literal('mobile_open_menu'),
    description: z.string(),
  }),
  z.object({
    kind: z.literal('mobile_close_menu'),
    description: z.string(),
  }),
  z.object({
    kind: z.literal('mobile_select_menu'),
    menuId: MobileMenuIdSchema,
    description: z.string(),
  }),
  z.object({
    kind: z.literal('mobile_open_bizform'),
    templateId: z.string(),
    title: z.string(),
    fields: z.array(BizFormFieldSeedSchema),
    description: z.string(),
  }),
  z.object({
    kind: z.literal('mobile_fill_bizform_field'),
    fieldId: z.string(),
    value: z.string(),
    description: z.string(),
  }),
  z.object({
    kind: z.literal('submit_bizform'),
    roomId: z.string(),
    bizformId: z.string(),
    title: z.string(),
    messageId: z.string().optional(),
    description: z.string(),
  }),
  z.object({
    kind: z.literal('switch_mobile_viewer'),
    participantId: z.string(),
    description: z.string(),
  }),
  z.object({
    kind: z.literal('highlight'),
    selector: z.string().nullable(),
    description: z.string(),
  }),
  z.object({
    kind: z.literal('wait'),
    ms: z.number().nonnegative(),
    description: z.string(),
  }),
]);

export const RoomEntrySeedSchema = z.object({
  id: z.string(),
  title: z.string(),
  participantCount: z.number().int().nonnegative(),
  preview: z.string(),
  device: z.enum(['PC', 'Mobile']).optional(),
  timestamp: z.string().optional(),
});

export const ParticipantSeedSchema = z.object({
  id: z.string(),
  displayName: z.string(),
  external: z.boolean(),
  isHost: z.boolean().optional(),
  device: z.enum(['PC', 'Mobile', 'Web']).optional(),
  online: z.boolean().optional(),
});

export const UISimSeedSchema = z.object({
  rooms: z.array(RoomEntrySeedSchema).optional(),
  currentRoomId: z.string().optional(),
  mobileViewerParticipantId: z.string().optional(),
  roomTalks: z.record(z.string(), z.array(TalkSchema)).optional(),
  participants: z.record(z.string(), z.array(ParticipantSeedSchema)).optional(),
  inputs: z.record(z.string(), z.string()).optional(),
  modals: z
    .record(
      z.string(),
      z.object({
        open: z.boolean(),
        step: z.number().int().optional(),
        tab: z.string().optional(),
      })
    )
    .optional(),
});

export const StepSchema = z.object({
  id: z.string(),
  order: z.number().int().nonnegative(),
  title: z.string(),
  description: z.string().optional(),
  guide: z.string().optional(),
  durationMs: z.number().positive().optional(),
  autoAdvance: z.boolean().optional(),
  talks: z.array(TalkSchema).default([]),
  actions: z.array(UIActionSchema).optional(),
  uiState: z.record(z.string(), z.unknown()).optional(),
});

export const ImpactMetricSchema = z.object({
  label: z.string(),
  before: z.number(),
  after: z.number(),
  unit: z.enum(['%', 'min', 'count']),
  improvementDirection: z.enum(['down', 'up']),
});

export const ScenarioSchema = z.object({
  id: z.string(),
  title: z.string(),
  summary: z.string().optional(),
  category: z.enum([
    'customer-case',
    'feature',
    'future-concept',
    'industry',
  ]),
  customer: z
    .object({
      id: z.string(),
      name: z.string(),
      logoUrl: z.string().optional(),
    })
    .optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  durationMinutes: z.number().positive(),
  devices: z.array(DeviceKindSchema),
  extends: z.string().optional(),
  seed: UISimSeedSchema.optional(),
  steps: z.array(StepSchema),
  beforeSteps: z.array(StepSchema).optional(),
  metrics: z.array(ImpactMetricSchema).optional(),
  goals: z.array(z.string()).optional(),
});

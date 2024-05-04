import Script, {
  ScriptEnvironment,
  ScriptPage,
  ScriptRunPhase,
} from './Script';
import { beforeEach, expect, it, jest } from '@jest/globals';
import ScriptRunner from './ScriptRunner';

interface FakeScriptOptions {
  id: string;
  priority: number;
}

class FakeScript extends Script {
  id: string;
  priority: number;
  page: ScriptPage.CommunityConsole;
  environment: ScriptEnvironment.ContentScript;
  runPhase: ScriptRunPhase.Main;

  constructor(options: FakeScriptOptions) {
    super();
    this.id = options.id;
    this.priority = options.priority;
  }

  execute() {}
}

const fakeScriptMock = jest
  .spyOn(FakeScript.prototype, 'execute')
  .mockImplementation(function() {
    return (this as FakeScript).id;
  });

beforeEach(() => {
  jest.clearAllMocks();
});

it('scripts run in the correct order based on priority', () => {
  const scriptsConfig = [
    {
      script: new FakeScript({
        id: '1',
        priority: 1,
      }),
      expectedRunPosition: 2,
    },
    {
      script: new FakeScript({
        id: '2',
        priority: 1000,
      }),
      expectedRunPosition: 3,
    },
    {
      script: new FakeScript({
        id: '3',
        priority: 0,
      }),
      expectedRunPosition: 1,
    },
    {
      script: new FakeScript({
        id: '4',
        priority: 2 ** 31,
      }),
      expectedRunPosition: 4,
    },
  ];

  const scriptRunner = new ScriptRunner();
  scriptRunner.add(...scriptsConfig.map((config) => config.script));
  scriptRunner.run();

  expect(fakeScriptMock).toHaveBeenCalledTimes(scriptsConfig.length);
  for (const config of scriptsConfig) {
    expect(fakeScriptMock).toHaveNthReturnedWith(
      config.expectedRunPosition,
      config.script.id,
    );
  }
});

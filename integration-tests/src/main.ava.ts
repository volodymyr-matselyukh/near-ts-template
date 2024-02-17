import { Worker, NearAccount } from 'near-workspaces';
import anyTest, { TestFn } from 'ava';

const test = anyTest as TestFn<{
  worker: Worker;
  accounts: Record<string, NearAccount>;
}>;

test.beforeEach(async (t) => {
  // Init the worker and start a Sandbox server
  const worker = await Worker.init();

  // Deploy contract
  const root = worker.rootAccount;
  const contract = await root.createSubAccount('test_account');
  // Get wasm file path from package.json test script in folder above

  await contract.deploy(
    process.argv[2],
  );

  // Save state for test runs, it is unique for each test
  t.context.worker = worker;
  t.context.accounts = { root, contract };
});

test.afterEach.always(async (t) => {
  // Stop Sandbox server
  await t.context.worker.tearDown().catch((error) => {
    console.log('Failed to stop the Sandbox:', error);
  });
});

test('get current value', async (t) => {
  const { contract } = t.context.accounts;
  const num: number = await contract.view('get_value', {});
  t.is(num, 0);
});

test('increase value', async (t) => {
  const { contract, root } = t.context.accounts;

  await root.call(contract, 'increment', {});

  const num: number = await contract.view('get_value', {});
  t.is(num, 1);
});

test('decrease value', async (t) => {
  const { contract, root } = t.context.accounts;

  await root.call(contract, 'increment', {});
  await root.call(contract, 'decrement', {});

  const num: number = await contract.view('get_value', {});
  t.is(num, 0);
});

test('cheating', async (t) => {
  const { contract, root } = t.context.accounts;

  await root.call(contract, 'cheat_with_money', {}, { attachedDeposit: "100" });

  const num: number = await contract.view('get_value', {});
  t.is(num, 10);
});

test('cheating and resetting', async (t) => {
  const { contract, root } = t.context.accounts;

  await root.call(contract, 'cheat_with_money', {}, { attachedDeposit: "100" });

  let num: number = await contract.view('get_value', {});
  t.is(num, 10);

  await contract.call(contract, 'reset_counter', {});
  num = await contract.view('get_value', {});

  t.is(num, 0);
});
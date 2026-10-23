/**
 * LendLoop Official Damage and Refund Policy Engine (Option B)
 * Calculations executed in integer minor units (paise: 1 INR = 100 paise)
 * to eliminate floating-point currency rounding errors.
 */

export interface SettlementInput {
  depositInInr: number;
  approvedDamageInInr: number;
  isDisputed?: boolean;
}

export interface SettlementResult {
  depositPaise: number;
  deductionPaise: number;
  refundPaise: number;
  excessClaimPaise: number;
  depositInInr: number;
  approvedDamageInInr: number;
  eligibleRefundInInr: number;
  excessClaimInInr: number;
  caseCategory: 'Case A: No Damage' | 'Case B: Verified Damage' | 'Case C: Disputed' | 'Case D: Damage Exceeds Deposit';
  summary: string;
}

export function calculateSettlement(input: SettlementInput): SettlementResult {
  // Convert strictly to integer paise
  const depositPaise = Math.max(0, Math.round(input.depositInInr * 100));
  const rawDamagePaise = Math.max(0, Math.round(input.approvedDamageInInr * 100));

  if (input.isDisputed) {
    return {
      depositPaise,
      deductionPaise: 0,
      refundPaise: 0,
      excessClaimPaise: 0,
      depositInInr: input.depositInInr,
      approvedDamageInInr: input.approvedDamageInInr,
      eligibleRefundInInr: 0,
      excessClaimInInr: 0,
      caseCategory: 'Case C: Disputed',
      summary: 'Deduction is disputed. Funds are safely held while under administrative review.'
    };
  }

  // Case A: No damage
  if (rawDamagePaise === 0) {
    return {
      depositPaise,
      deductionPaise: 0,
      refundPaise: depositPaise,
      excessClaimPaise: 0,
      depositInInr: input.depositInInr,
      approvedDamageInInr: 0,
      eligibleRefundInInr: depositPaise / 100,
      excessClaimInInr: 0,
      caseCategory: 'Case A: No Damage',
      summary: 'Item returned in verified condition. 100% of security deposit refunded.'
    };
  }

  // Case D: Damage exceeds deposit
  if (rawDamagePaise > depositPaise) {
    const excessPaise = rawDamagePaise - depositPaise;
    return {
      depositPaise,
      deductionPaise: depositPaise,
      refundPaise: 0,
      excessClaimPaise: excessPaise,
      depositInInr: input.depositInInr,
      approvedDamageInInr: input.approvedDamageInInr,
      eligibleRefundInInr: 0,
      excessClaimInInr: excessPaise / 100,
      caseCategory: 'Case D: Damage Exceeds Deposit',
      summary: `Verified repair cost (₹${rawDamagePaise / 100}) exceeds deposit (₹${depositPaise / 100}). Deposit deduction is capped at deposit amount. The excess claim of ₹${excessPaise / 100} requires separate formal review and cannot be auto-debited.`
    };
  }

  // Case B: Verified damage <= deposit
  const refundPaise = depositPaise - rawDamagePaise;
  return {
    depositPaise,
    deductionPaise: rawDamagePaise,
    refundPaise,
    excessClaimPaise: 0,
    depositInInr: input.depositInInr,
    approvedDamageInInr: rawDamagePaise / 100,
    eligibleRefundInInr: refundPaise / 100,
    excessClaimInInr: 0,
    caseCategory: 'Case B: Verified Damage',
    summary: `Verified repair deduction of ₹${rawDamagePaise / 100} applied. Net refund of ₹${refundPaise / 100} released to borrower.`
  };
}

/**
 * Built-in Unit Test Suite for LendLoop Settlement Logic
 */
export function runSettlementUnitTests(): { name: string; passed: boolean; message: string }[] {
  const tests = [
    {
      name: 'Test 1: Undamaged item (₹80 deposit, ₹0 damage) -> 100% refund (₹80)',
      fn: () => {
        const res = calculateSettlement({ depositInInr: 80, approvedDamageInInr: 0 });
        return res.eligibleRefundInInr === 80 && res.deductionPaise === 0 && res.caseCategory === 'Case A: No Damage';
      }
    },
    {
      name: 'Test 2: Documented partial damage (₹80 deposit, ₹30 damage) -> ₹50 refund',
      fn: () => {
        const res = calculateSettlement({ depositInInr: 80, approvedDamageInInr: 30 });
        return res.eligibleRefundInInr === 50 && res.approvedDamageInInr === 30 && res.caseCategory === 'Case B: Verified Damage';
      }
    },
    {
      name: 'Test 3: Damage exceeds deposit (₹80 deposit, ₹100 damage) -> ₹0 refund, capped deduction, ₹20 excess claim flag',
      fn: () => {
        const res = calculateSettlement({ depositInInr: 80, approvedDamageInInr: 100 });
        return res.eligibleRefundInInr === 0 && res.depositInInr === 80 && res.excessClaimInInr === 20 && res.caseCategory === 'Case D: Damage Exceeds Deposit';
      }
    },
    {
      name: 'Test 4: Disputed damage flag holds settlement without automatic deduction',
      fn: () => {
        const res = calculateSettlement({ depositInInr: 100, approvedDamageInInr: 50, isDisputed: true });
        return res.caseCategory === 'Case C: Disputed' && res.deductionPaise === 0;
      }
    }
  ];

  return tests.map(t => {
    try {
      const passed = t.fn();
      return { name: t.name, passed, message: passed ? 'PASSED: Exact arithmetic verified.' : 'FAILED: Assertion mismatch.' };
    } catch (err: any) {
      return { name: t.name, passed: false, message: `ERROR: ${err.message}` };
    }
  });
}
